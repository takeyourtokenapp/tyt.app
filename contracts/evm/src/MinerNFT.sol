// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IFeeConfig {
    function calculateFees(bytes32 key, uint256 amount) external view returns (
        uint256 feeTotal,
        uint256 protocolFee,
        uint256 charityFee,
        uint256 academyFee
    );

    function getFeeRecipients(bytes32 key) external view returns (
        address protocolTreasury,
        address charityVault,
        address academyVault
    );
}

/**
 * @title MinerNFT
 * @notice TYT v3 Miner NFT - Represents ownership of virtual mining power
 * @dev ERC-721 with metadata for miner type, hashrate/power, level, efficiency, and region.
 *      Supports upgrades and status changes with proper event emission.
 *      Integrates with FeeConfigGovernance for 60/30/10 fee splits (Protocol/Charity/Academy).
 */
contract MinerNFT is ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    Counters.Counter private _tokenIdCounter;

    IFeeConfig public feeConfig;
    uint256 public mintPrice;

    struct MinerData {
        uint256 minerTypeId;
        uint256 powerHashrate;     // TH/s * 1e6
        uint256 level;             // 1-20
        bool isActive;
        uint256 mintedAt;
        uint256 lastUpgradeAt;
    }

    struct MinerMetadata {
        uint256 efficiencyWTH;     // W/TH * 1e6
        string region;             // "USA", "Canada", "EU", "Asia"
        uint256 maintenanceRate;   // basis points (100 = 1%)
    }

    mapping(uint256 => MinerData) private _minerData;
    mapping(uint256 => MinerMetadata) private _minerMetadata;

    uint256 public constant MAX_LEVEL = 20;
    uint256 public constant MAX_POWER = 1_000_000 * 1e6; // 1M TH/s * 1e6
    uint256 public constant MIN_EFFICIENCY = 10 * 1e6;   // 10 W/TH minimum
    uint256 public constant MAX_EFFICIENCY = 100 * 1e6;  // 100 W/TH maximum

    string private _baseTokenURI;

    event MinerMinted(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 powerTH,
        uint256 mintPrice,
        uint256 feeTotal,
        uint256 feeProtocol,
        uint256 feeCharity,
        uint256 feeAcademy
    );

    event MinerUpgraded(
        uint256 indexed tokenId,
        string upgradeType,
        uint256 newValue
    );

    event MinerStatusChanged(
        uint256 indexed tokenId,
        bool newStatus
    );

    event BaseURIUpdated(string newBaseURI);
    event FeeConfigUpdated(address indexed newFeeConfig);
    event MintPriceUpdated(uint256 newPrice);

    error MinerNotFound(uint256 tokenId);
    error NotOwnerOrApproved(uint256 tokenId, address caller);
    error InvalidPower(uint256 power);
    error InvalidEfficiency(uint256 efficiency);
    error InvalidRegion(string region);
    error InvalidLevel(uint256 level);
    error MinerInactive(uint256 tokenId);
    error AlreadyMaxLevel(uint256 tokenId);
    error InsufficientPayment(uint256 required, uint256 provided);
    error InvalidFeeConfig();
    error FeeTransferFailed();
    error ZeroAddress();

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        address admin,
        address _feeConfig,
        uint256 _mintPrice
    ) ERC721(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        _baseTokenURI = baseURI;
        feeConfig = IFeeConfig(_feeConfig);
        mintPrice = _mintPrice;
    }

    function mint(
        address to,
        uint256 minerTypeId,
        uint256 powerTH,
        uint256 efficiencyWTH,
        string calldata region
    ) external payable nonReentrant whenNotPaused returns (uint256) {
        if (to == address(0)) revert ZeroAddress();
        if (powerTH == 0 || powerTH > MAX_POWER) {
            revert InvalidPower(powerTH);
        }
        if (efficiencyWTH < MIN_EFFICIENCY || efficiencyWTH > MAX_EFFICIENCY) {
            revert InvalidEfficiency(efficiencyWTH);
        }
        if (!_isValidRegion(region)) {
            revert InvalidRegion(region);
        }
        if (msg.value < mintPrice) {
            revert InsufficientPayment(mintPrice, msg.value);
        }

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // CHECKS: Calculate fees
        (
            uint256 feeTotal,
            uint256 feeProtocol,
            uint256 feeCharity,
            uint256 feeAcademy,
            address protocolTreasury,
            address charityVault,
            address academyVault
        ) = _calculateFeesAndRecipients(msg.value);

        // EFFECTS: Mint NFT and update state
        _safeMint(to, tokenId);

        _minerData[tokenId] = MinerData({
            minerTypeId: minerTypeId,
            powerHashrate: powerTH,
            level: 1,
            isActive: true,
            mintedAt: block.timestamp,
            lastUpgradeAt: block.timestamp
        });

        _minerMetadata[tokenId] = MinerMetadata({
            efficiencyWTH: efficiencyWTH,
            region: region,
            maintenanceRate: 100  // Default 1% maintenance
        });

        emit MinerMinted(
            tokenId,
            to,
            powerTH,
            msg.value,
            feeTotal,
            feeProtocol,
            feeCharity,
            feeAcademy
        );

        // INTERACTIONS: Transfer fees (must be last)
        _distributeFees(
            feeProtocol,
            feeCharity,
            feeAcademy,
            protocolTreasury,
            charityVault,
            academyVault
        );

        return tokenId;
    }

    function mintFree(
        address to,
        uint256 minerTypeId,
        uint256 powerTH,
        uint256 efficiencyWTH,
        string calldata region
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        if (to == address(0)) revert ZeroAddress();
        if (powerTH == 0 || powerTH > MAX_POWER) {
            revert InvalidPower(powerTH);
        }
        if (efficiencyWTH < MIN_EFFICIENCY || efficiencyWTH > MAX_EFFICIENCY) {
            revert InvalidEfficiency(efficiencyWTH);
        }
        if (!_isValidRegion(region)) {
            revert InvalidRegion(region);
        }

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);

        _minerData[tokenId] = MinerData({
            minerTypeId: minerTypeId,
            powerHashrate: powerTH,
            level: 1,
            isActive: true,
            mintedAt: block.timestamp,
            lastUpgradeAt: block.timestamp
        });

        _minerMetadata[tokenId] = MinerMetadata({
            efficiencyWTH: efficiencyWTH,
            region: region,
            maintenanceRate: 100
        });

        emit MinerMinted(tokenId, to, powerTH, 0, 0, 0, 0, 0);

        return tokenId;
    }

    function _calculateFeesAndRecipients(uint256 amount) internal view returns (
        uint256 feeTotal,
        uint256 protocolFee,
        uint256 charityFee,
        uint256 academyFee,
        address protocolTreasury,
        address charityVault,
        address academyVault
    ) {
        bytes32 mintKey = keccak256("mint.default");

        (feeTotal, protocolFee, charityFee, academyFee) = feeConfig.calculateFees(mintKey, amount);

        (protocolTreasury, charityVault, academyVault) = feeConfig.getFeeRecipients(mintKey);
    }

    function _distributeFees(
        uint256 protocolFee,
        uint256 charityFee,
        uint256 academyFee,
        address protocolTreasury,
        address charityVault,
        address academyVault
    ) internal {
        // Transfer fees to recipients - INTERACTIONS (must be called after all state changes)
        if (protocolFee > 0) {
            (bool success, ) = protocolTreasury.call{value: protocolFee}("");
            if (!success) revert FeeTransferFailed();
        }

        if (charityFee > 0) {
            (bool success, ) = charityVault.call{value: charityFee}("");
            if (!success) revert FeeTransferFailed();
        }

        if (academyFee > 0) {
            (bool success, ) = academyVault.call{value: academyFee}("");
            if (!success) revert FeeTransferFailed();
        }
    }

    function upgradePower(
        uint256 tokenId,
        uint256 newPowerTH
    ) external onlyRole(UPGRADER_ROLE) whenNotPaused {
        if (!_exists(tokenId)) revert MinerNotFound(tokenId);

        MinerData storage miner = _minerData[tokenId];

        if (!miner.isActive) revert MinerInactive(tokenId);
        if (newPowerTH == 0 || newPowerTH > MAX_POWER) revert InvalidPower(newPowerTH);
        if (newPowerTH <= miner.powerHashrate) revert InvalidPower(newPowerTH);

        miner.powerHashrate = newPowerTH;
        miner.lastUpgradeAt = block.timestamp;

        emit MinerUpgraded(tokenId, "power", newPowerTH);
    }

    function upgradeEfficiency(
        uint256 tokenId,
        uint256 newEfficiency
    ) external onlyRole(UPGRADER_ROLE) whenNotPaused {
        if (!_exists(tokenId)) revert MinerNotFound(tokenId);

        MinerData storage miner = _minerData[tokenId];
        MinerMetadata storage metadata = _minerMetadata[tokenId];

        if (!miner.isActive) revert MinerInactive(tokenId);
        if (newEfficiency < MIN_EFFICIENCY || newEfficiency > MAX_EFFICIENCY) {
            revert InvalidEfficiency(newEfficiency);
        }
        if (newEfficiency >= metadata.efficiencyWTH) {
            revert InvalidEfficiency(newEfficiency);
        }

        metadata.efficiencyWTH = newEfficiency;
        miner.lastUpgradeAt = block.timestamp;

        emit MinerUpgraded(tokenId, "efficiency", newEfficiency);
    }

    function setActive(
        uint256 tokenId,
        bool isActive
    ) external onlyRole(UPGRADER_ROLE) whenNotPaused {
        if (!_exists(tokenId)) revert MinerNotFound(tokenId);

        _minerData[tokenId].isActive = isActive;

        emit MinerStatusChanged(tokenId, isActive);
    }

    function getMinerData(uint256 tokenId) external view returns (
        uint256 minerTypeId,
        uint256 powerHashrate,
        uint256 level,
        bool isActive,
        uint256 mintedAt,
        uint256 lastUpgradeAt
    ) {
        if (!_exists(tokenId)) revert MinerNotFound(tokenId);

        MinerData storage miner = _minerData[tokenId];
        return (
            miner.minerTypeId,
            miner.powerHashrate,
            miner.level,
            miner.isActive,
            miner.mintedAt,
            miner.lastUpgradeAt
        );
    }

    function getMinerMetadata(uint256 tokenId) external view returns (
        uint256 efficiencyWTH,
        string memory region,
        uint256 maintenanceRate
    ) {
        if (!_exists(tokenId)) revert MinerNotFound(tokenId);

        MinerMetadata storage metadata = _minerMetadata[tokenId];
        return (
            metadata.efficiencyWTH,
            metadata.region,
            metadata.maintenanceRate
        );
    }

    function getCompleteMinerInfo(uint256 tokenId) external view returns (
        MinerData memory data,
        MinerMetadata memory metadata
    ) {
        if (!_exists(tokenId)) revert MinerNotFound(tokenId);

        return (_minerData[tokenId], _minerMetadata[tokenId]);
    }

    function getPower(uint256 tokenId) external view returns (uint256) {
        if (!_exists(tokenId)) revert MinerNotFound(tokenId);
        return _minerData[tokenId].powerHashrate;
    }

    function getLevel(uint256 tokenId) external view returns (uint256) {
        if (!_exists(tokenId)) revert MinerNotFound(tokenId);
        return _minerData[tokenId].level;
    }

    function isActive(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) revert MinerNotFound(tokenId);
        return _minerData[tokenId].isActive;
    }

    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function setBaseURI(string calldata newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function setFeeConfig(address _feeConfig) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_feeConfig == address(0)) revert InvalidFeeConfig();
        feeConfig = IFeeConfig(_feeConfig);
        emit FeeConfigUpdated(_feeConfig);
    }

    function setMintPrice(uint256 _mintPrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        mintPrice = _mintPrice;
        emit MintPriceUpdated(_mintPrice);
    }

    function setMaintenanceRate(
        uint256 tokenId,
        uint256 newRate
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!_exists(tokenId)) revert MinerNotFound(tokenId);
        if (newRate > 1000) revert InvalidLevel(newRate); // Max 10%

        _minerMetadata[tokenId].maintenanceRate = newRate;
    }

    function _isValidRegion(string memory region) internal pure returns (bool) {
        bytes32 regionHash = keccak256(bytes(region));
        return (
            regionHash == keccak256("USA") ||
            regionHash == keccak256("Canada") ||
            regionHash == keccak256("EU") ||
            regionHash == keccak256("Asia")
        );
    }

    function withdrawBalance() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = msg.sender.call{value: balance}("");
            require(success, "Withdrawal failed");
        }
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete _minerData[tokenId];
        delete _minerMetadata[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
