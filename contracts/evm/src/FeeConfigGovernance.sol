// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title FeeConfigGovernance
 * @notice TYT v3 Fee Configuration with Governance & Timelock
 * @dev Manages fee profiles with 60/30/10 split (Protocol/Charity/Academy)
 *      Includes governance voting and timelock for security
 *
 * Fee Structure:
 * - Protocol Treasury: 60% (operations, development, liquidity)
 * - Children's Brain Cancer Foundation: 30% (research, grants, support)
 * - Digital Academy: 10% (education, content, rewards)
 */
contract FeeConfigGovernance is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant FEE_SETTER_ROLE = keccak256("FEE_SETTER_ROLE");
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    bytes32 public constant TIMELOCK_ADMIN_ROLE = keccak256("TIMELOCK_ADMIN_ROLE");

    uint256 public constant MAX_FEE_BPS = 2000; // 20% max
    uint256 public constant BPS_DENOMINATOR = 10_000;
    uint256 public constant MIN_TIMELOCK_DELAY = 2 days;
    uint256 public constant MAX_TIMELOCK_DELAY = 30 days;

    struct FeeProfile {
        uint256 totalBps;
        address protocolTreasury;
        address charityVault;
        address academyVault;
        uint256 protocolSplitBps; // 6000 = 60%
        uint256 charitySplitBps;  // 3000 = 30%
        uint256 academySplitBps;  // 1000 = 10%
        bool exists;
    }

    struct TimelockProposal {
        bytes32 profileKey;
        uint256 totalBps;
        address protocolTreasury;
        address charityVault;
        address academyVault;
        uint256 protocolSplitBps;
        uint256 charitySplitBps;
        uint256 academySplitBps;
        uint256 executeAfter;
        bool executed;
        bool cancelled;
    }

    mapping(bytes32 => FeeProfile) private _profiles;
    bytes32[] private _profileKeys;

    mapping(bytes32 => TimelockProposal) public timelockProposals;
    uint256 public timelockDelay;
    uint256 public proposalCount;

    // Default keys
    bytes32 public constant DEPOSIT_KEY = keccak256("deposit.default");
    bytes32 public constant MARKETPLACE_KEY = keccak256("marketplace.default");
    bytes32 public constant WITHDRAWAL_KEY = keccak256("withdrawal.default");
    bytes32 public constant MAINTENANCE_KEY = keccak256("maintenance.default");
    bytes32 public constant MINT_KEY = keccak256("mint.default");

    event FeeProfileUpdated(
        bytes32 indexed key,
        uint256 totalBps,
        address protocolTreasury,
        address charityVault,
        address academyVault,
        uint256 protocolSplitBps,
        uint256 charitySplitBps,
        uint256 academySplitBps
    );

    event ProposalCreated(
        bytes32 indexed proposalId,
        bytes32 indexed profileKey,
        uint256 executeAfter
    );

    event ProposalExecuted(bytes32 indexed proposalId);
    event ProposalCancelled(bytes32 indexed proposalId);
    event TimelockDelayUpdated(uint256 oldDelay, uint256 newDelay);

    error InvalidFeeAmount(uint256 provided, uint256 max);
    error InvalidSplit(uint256 sum, uint256 expected);
    error ZeroAddress();
    error ProfileNotFound(bytes32 key);
    error ProposalNotReady(uint256 executeAfter, uint256 currentTime);
    error ProposalAlreadyExecuted();
    error ProposalCancelled();
    error InvalidTimelockDelay(uint256 delay);

    constructor(
        address admin,
        address protocolTreasury,
        address charityVault,
        address academyVault
    ) {
        if (admin == address(0) || protocolTreasury == address(0) ||
            charityVault == address(0) || academyVault == address(0)) {
            revert ZeroAddress();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(FEE_SETTER_ROLE, admin);
        _grantRole(GOVERNANCE_ROLE, admin);
        _grantRole(TIMELOCK_ADMIN_ROLE, admin);

        timelockDelay = 2 days;

        // Initialize default fee profiles with 60/30/10 split
        _initializeDefaultProfiles(protocolTreasury, charityVault, academyVault);
    }

    function _initializeDefaultProfiles(
        address protocolTreasury,
        address charityVault,
        address academyVault
    ) internal {
        // Deposit fees: 1% total
        _setProfileInternal(
            DEPOSIT_KEY,
            100, // 1%
            protocolTreasury,
            charityVault,
            academyVault,
            6000, // 60%
            3000, // 30%
            1000  // 10%
        );

        // Marketplace fees: 2.5% total
        _setProfileInternal(
            MARKETPLACE_KEY,
            250, // 2.5%
            protocolTreasury,
            charityVault,
            academyVault,
            6000,
            3000,
            1000
        );

        // Withdrawal fees: 0.5% total
        _setProfileInternal(
            WITHDRAWAL_KEY,
            50, // 0.5%
            protocolTreasury,
            charityVault,
            academyVault,
            6000,
            3000,
            1000
        );

        // Maintenance fees: 1% total
        _setProfileInternal(
            MAINTENANCE_KEY,
            100, // 1%
            protocolTreasury,
            charityVault,
            academyVault,
            6000,
            3000,
            1000
        );

        // Mint fees: 1.5% total
        _setProfileInternal(
            MINT_KEY,
            150, // 1.5%
            protocolTreasury,
            charityVault,
            academyVault,
            6000,
            3000,
            1000
        );
    }

    function _setProfileInternal(
        bytes32 key,
        uint256 totalBps,
        address protocolTreasury,
        address charityVault,
        address academyVault,
        uint256 protocolSplitBps,
        uint256 charitySplitBps,
        uint256 academySplitBps
    ) internal {
        if (totalBps > MAX_FEE_BPS) {
            revert InvalidFeeAmount(totalBps, MAX_FEE_BPS);
        }

        uint256 splitSum = protocolSplitBps + charitySplitBps + academySplitBps;
        if (splitSum != BPS_DENOMINATOR) {
            revert InvalidSplit(splitSum, BPS_DENOMINATOR);
        }

        if (protocolTreasury == address(0) || charityVault == address(0) || academyVault == address(0)) {
            revert ZeroAddress();
        }

        if (!_profiles[key].exists) {
            _profileKeys.push(key);
        }

        _profiles[key] = FeeProfile({
            totalBps: totalBps,
            protocolTreasury: protocolTreasury,
            charityVault: charityVault,
            academyVault: academyVault,
            protocolSplitBps: protocolSplitBps,
            charitySplitBps: charitySplitBps,
            academySplitBps: academySplitBps,
            exists: true
        });

        emit FeeProfileUpdated(
            key,
            totalBps,
            protocolTreasury,
            charityVault,
            academyVault,
            protocolSplitBps,
            charitySplitBps,
            academySplitBps
        );
    }

    /**
     * @notice Propose a fee profile change with timelock
     * @dev Creates a proposal that can be executed after timelock delay
     */
    function proposeFeeProfileChange(
        bytes32 profileKey,
        uint256 totalBps,
        address protocolTreasury,
        address charityVault,
        address academyVault,
        uint256 protocolSplitBps,
        uint256 charitySplitBps,
        uint256 academySplitBps
    ) external onlyRole(GOVERNANCE_ROLE) returns (bytes32 proposalId) {
        proposalId = keccak256(abi.encodePacked(
            profileKey,
            totalBps,
            protocolTreasury,
            charityVault,
            academyVault,
            protocolSplitBps,
            charitySplitBps,
            academySplitBps,
            block.timestamp,
            proposalCount++
        ));

        timelockProposals[proposalId] = TimelockProposal({
            profileKey: profileKey,
            totalBps: totalBps,
            protocolTreasury: protocolTreasury,
            charityVault: charityVault,
            academyVault: academyVault,
            protocolSplitBps: protocolSplitBps,
            charitySplitBps: charitySplitBps,
            academySplitBps: academySplitBps,
            executeAfter: block.timestamp + timelockDelay,
            executed: false,
            cancelled: false
        });

        emit ProposalCreated(proposalId, profileKey, block.timestamp + timelockDelay);
    }

    /**
     * @notice Execute a timelock proposal
     * @dev Can only be executed after timelock delay has passed
     */
    function executeProposal(bytes32 proposalId) external onlyRole(GOVERNANCE_ROLE) nonReentrant {
        TimelockProposal storage proposal = timelockProposals[proposalId];

        if (proposal.cancelled) revert ProposalCancelled();
        if (proposal.executed) revert ProposalAlreadyExecuted();
        if (block.timestamp < proposal.executeAfter) {
            revert ProposalNotReady(proposal.executeAfter, block.timestamp);
        }

        proposal.executed = true;

        _setProfileInternal(
            proposal.profileKey,
            proposal.totalBps,
            proposal.protocolTreasury,
            proposal.charityVault,
            proposal.academyVault,
            proposal.protocolSplitBps,
            proposal.charitySplitBps,
            proposal.academySplitBps
        );

        emit ProposalExecuted(proposalId);
    }

    /**
     * @notice Cancel a pending proposal
     */
    function cancelProposal(bytes32 proposalId) external onlyRole(TIMELOCK_ADMIN_ROLE) {
        TimelockProposal storage proposal = timelockProposals[proposalId];

        if (proposal.executed) revert ProposalAlreadyExecuted();
        if (proposal.cancelled) revert ProposalCancelled();

        proposal.cancelled = true;

        emit ProposalCancelled(proposalId);
    }

    /**
     * @notice Instant fee profile update (only for emergency admin)
     * @dev Bypasses timelock - use with extreme caution
     */
    function setFeeProfileInstant(
        bytes32 key,
        uint256 totalBps,
        address protocolTreasury,
        address charityVault,
        address academyVault,
        uint256 protocolSplitBps,
        uint256 charitySplitBps,
        uint256 academySplitBps
    ) external onlyRole(FEE_SETTER_ROLE) {
        _setProfileInternal(
            key,
            totalBps,
            protocolTreasury,
            charityVault,
            academyVault,
            protocolSplitBps,
            charitySplitBps,
            academySplitBps
        );
    }

    /**
     * @notice Calculate fees for a given amount
     * @return feeTotal Total fee amount
     * @return protocolFee Amount for protocol treasury
     * @return charityFee Amount for charity vault
     * @return academyFee Amount for academy vault
     */
    function calculateFees(bytes32 key, uint256 amount) external view returns (
        uint256 feeTotal,
        uint256 protocolFee,
        uint256 charityFee,
        uint256 academyFee
    ) {
        FeeProfile storage profile = _profiles[key];
        if (!profile.exists) {
            revert ProfileNotFound(key);
        }

        feeTotal = (amount * profile.totalBps) / BPS_DENOMINATOR;
        protocolFee = (feeTotal * profile.protocolSplitBps) / BPS_DENOMINATOR;
        charityFee = (feeTotal * profile.charitySplitBps) / BPS_DENOMINATOR;
        academyFee = (feeTotal * profile.academySplitBps) / BPS_DENOMINATOR;
    }

    /**
     * @notice Get fee recipients for a profile
     */
    function getFeeRecipients(bytes32 key) external view returns (
        address protocolTreasury,
        address charityVault,
        address academyVault
    ) {
        FeeProfile storage profile = _profiles[key];
        if (!profile.exists) {
            revert ProfileNotFound(key);
        }

        return (profile.protocolTreasury, profile.charityVault, profile.academyVault);
    }

    /**
     * @notice Get complete fee profile
     */
    function getFeeProfile(bytes32 key) external view returns (FeeProfile memory) {
        if (!_profiles[key].exists) {
            revert ProfileNotFound(key);
        }
        return _profiles[key];
    }

    /**
     * @notice Update timelock delay
     */
    function setTimelockDelay(uint256 newDelay) external onlyRole(TIMELOCK_ADMIN_ROLE) {
        if (newDelay < MIN_TIMELOCK_DELAY || newDelay > MAX_TIMELOCK_DELAY) {
            revert InvalidTimelockDelay(newDelay);
        }

        uint256 oldDelay = timelockDelay;
        timelockDelay = newDelay;

        emit TimelockDelayUpdated(oldDelay, newDelay);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function profileExists(bytes32 key) external view returns (bool) {
        return _profiles[key].exists;
    }

    function getProfileKeys() external view returns (bytes32[] memory) {
        return _profileKeys;
    }

    function getProfileCount() external view returns (uint256) {
        return _profileKeys.length;
    }
}
