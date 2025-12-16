// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title VotingEscrowTYT (veTYT)
 * @notice Vote-escrowed TYT for time-locked governance voting power
 * @dev Users lock TYT tokens for a duration (1 week to 4 years) to receive voting power.
 *      Voting power is linearly proportional to lock duration.
 *      Longer locks = more voting power = more governance influence.
 */
contract VotingEscrowTYT is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IERC20 public immutable tytToken;

    uint256 public constant MIN_LOCK_DURATION = 1 weeks;
    uint256 public constant MAX_LOCK_DURATION = 4 * 365 days; // 4 years
    uint256 public constant VOTING_POWER_MULTIPLIER = 1e18;

    uint256 private _lockIdCounter;

    struct Lock {
        uint256 amount;          // Amount of TYT locked
        uint256 start;           // Lock start timestamp
        uint256 end;             // Lock end timestamp
        uint256 votingPower;     // Calculated voting power at lock time
        bool withdrawn;          // Whether tokens have been withdrawn
    }

    // lockId => Lock
    mapping(uint256 => Lock) public locks;

    // user => lockIds[]
    mapping(address => uint256[]) public userLocks;

    // lockId => owner (for efficient lookup)
    mapping(uint256 => address) public lockOwner;

    // user => total active voting power
    mapping(address => uint256) public userVotingPower;

    uint256 public totalVotingPower;

    event LockCreated(
        address indexed user,
        uint256 indexed lockId,
        uint256 amount,
        uint256 duration,
        uint256 votingPower
    );

    event LockIncreased(
        address indexed user,
        uint256 indexed lockId,
        uint256 addedAmount,
        uint256 newVotingPower
    );

    event LockExtended(
        address indexed user,
        uint256 indexed lockId,
        uint256 newEnd,
        uint256 newVotingPower
    );

    event LockWithdrawn(
        address indexed user,
        uint256 indexed lockId,
        uint256 amount
    );

    event EmergencyUnlock(
        address indexed user,
        uint256 indexed lockId,
        uint256 amount,
        uint256 penalty
    );

    constructor(address _tytToken) {
        require(_tytToken != address(0), "Invalid TYT token");
        tytToken = IERC20(_tytToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Create a new lock
     * @param amount Amount of TYT to lock
     * @param duration Lock duration in seconds (must be between MIN and MAX)
     * @return lockId The ID of the created lock
     */
    function createLock(uint256 amount, uint256 duration)
        external
        nonReentrant
        returns (uint256 lockId)
    {
        require(amount > 0, "Amount must be > 0");
        require(
            duration >= MIN_LOCK_DURATION && duration <= MAX_LOCK_DURATION,
            "Invalid duration"
        );

        lockId = ++_lockIdCounter;

        uint256 start = block.timestamp;
        uint256 end = start + duration;
        uint256 votingPower = _calculateVotingPower(amount, duration);

        locks[lockId] = Lock({
            amount: amount,
            start: start,
            end: end,
            votingPower: votingPower,
            withdrawn: false
        });

        userLocks[msg.sender].push(lockId);
        lockOwner[lockId] = msg.sender;
        userVotingPower[msg.sender] += votingPower;
        totalVotingPower += votingPower;

        tytToken.safeTransferFrom(msg.sender, address(this), amount);

        emit LockCreated(msg.sender, lockId, amount, duration, votingPower);
    }

    /**
     * @notice Increase the amount locked in an existing lock
     * @param lockId The ID of the lock to increase
     * @param addedAmount Additional amount to lock
     */
    function increaseAmount(uint256 lockId, uint256 addedAmount)
        external
        nonReentrant
    {
        require(addedAmount > 0, "Amount must be > 0");
        require(_isUserLock(msg.sender, lockId), "Not lock owner");

        Lock storage lock = locks[lockId];
        require(!lock.withdrawn, "Lock already withdrawn");
        require(lock.end > block.timestamp, "Lock expired");

        uint256 remainingDuration = lock.end - block.timestamp;
        uint256 oldVotingPower = lock.votingPower;

        // Recalculate voting power with new total amount
        uint256 newAmount = lock.amount + addedAmount;
        uint256 newVotingPower = _calculateVotingPower(newAmount, remainingDuration);

        lock.amount = newAmount;
        lock.votingPower = newVotingPower;

        // Update user and total voting power
        userVotingPower[msg.sender] = userVotingPower[msg.sender] - oldVotingPower + newVotingPower;
        totalVotingPower = totalVotingPower - oldVotingPower + newVotingPower;

        tytToken.safeTransferFrom(msg.sender, address(this), addedAmount);

        emit LockIncreased(msg.sender, lockId, addedAmount, newVotingPower);
    }

    /**
     * @notice Extend the duration of an existing lock
     * @param lockId The ID of the lock to extend
     * @param addedDuration Additional duration to add (in seconds)
     */
    function increaseDuration(uint256 lockId, uint256 addedDuration)
        external
        nonReentrant
    {
        require(addedDuration > 0, "Duration must be > 0");
        require(_isUserLock(msg.sender, lockId), "Not lock owner");

        Lock storage lock = locks[lockId];
        require(!lock.withdrawn, "Lock already withdrawn");
        require(lock.end > block.timestamp, "Lock expired");

        uint256 newEnd = lock.end + addedDuration;
        uint256 totalDuration = newEnd - lock.start;
        require(totalDuration <= MAX_LOCK_DURATION, "Exceeds max duration");

        uint256 newDuration = newEnd - block.timestamp;
        uint256 oldVotingPower = lock.votingPower;
        uint256 newVotingPower = _calculateVotingPower(lock.amount, newDuration);

        lock.end = newEnd;
        lock.votingPower = newVotingPower;

        userVotingPower[msg.sender] = userVotingPower[msg.sender] - oldVotingPower + newVotingPower;
        totalVotingPower = totalVotingPower - oldVotingPower + newVotingPower;

        emit LockExtended(msg.sender, lockId, newEnd, newVotingPower);
    }

    /**
     * @notice Withdraw tokens from an expired lock
     * @param lockId The ID of the lock to withdraw from
     */
    function withdraw(uint256 lockId) external nonReentrant {
        require(_isUserLock(msg.sender, lockId), "Not lock owner");

        Lock storage lock = locks[lockId];
        require(!lock.withdrawn, "Already withdrawn");
        require(block.timestamp >= lock.end, "Lock not expired");

        lock.withdrawn = true;

        // Remove voting power
        userVotingPower[msg.sender] -= lock.votingPower;
        totalVotingPower -= lock.votingPower;

        uint256 amount = lock.amount;
        tytToken.safeTransfer(msg.sender, amount);

        emit LockWithdrawn(msg.sender, lockId, amount);
    }

    /**
     * @notice Get voting power for a user (sum of all active locks)
     * @param user Address of the user
     * @return Current voting power
     */
    function getVotingPower(address user) external view returns (uint256) {
        return userVotingPower[user];
    }

    /**
     * @notice Get all lock IDs for a user
     * @param user Address of the user
     * @return Array of lock IDs
     */
    function getUserLocks(address user) external view returns (uint256[] memory) {
        return userLocks[user];
    }

    /**
     * @notice Get detailed information about a lock
     * @param lockId The ID of the lock
     * @return amount Amount locked
     * @return start Start timestamp
     * @return end End timestamp
     * @return votingPower Current voting power
     * @return withdrawn Whether withdrawn
     */
    function getLockInfo(uint256 lockId)
        external
        view
        returns (
            uint256 amount,
            uint256 start,
            uint256 end,
            uint256 votingPower,
            bool withdrawn
        )
    {
        Lock memory lock = locks[lockId];
        return (
            lock.amount,
            lock.start,
            lock.end,
            lock.votingPower,
            lock.withdrawn
        );
    }

    /**
     * @dev Calculate voting power based on amount and duration
     * Voting power = amount * (duration / MAX_LOCK_DURATION)
     * Linear relationship: max duration = 1x multiplier
     */
    function _calculateVotingPower(uint256 amount, uint256 duration)
        internal
        pure
        returns (uint256)
    {
        return (amount * duration * VOTING_POWER_MULTIPLIER) / MAX_LOCK_DURATION / VOTING_POWER_MULTIPLIER;
    }

    /**
     * @dev Check if a lock belongs to a user
     */
    function _isUserLock(address user, uint256 lockId) internal view returns (bool) {
        return lockOwner[lockId] == user;
    }

    /**
     * @notice Emergency unlock with penalty (ADMIN only)
     * @dev Used in extreme cases, applies 50% penalty
     * @param lockId Lock to emergency unlock
     */
    function emergencyUnlock(uint256 lockId)
        external
        nonReentrant
        onlyRole(ADMIN_ROLE)
    {
        Lock storage lock = locks[lockId];
        require(!lock.withdrawn, "Already withdrawn");

        lock.withdrawn = true;

        address owner = _findLockOwner(lockId);
        require(owner != address(0), "Owner not found");

        userVotingPower[owner] -= lock.votingPower;
        totalVotingPower -= lock.votingPower;

        uint256 penalty = lock.amount / 2; // 50% penalty
        uint256 returnAmount = lock.amount - penalty;

        tytToken.safeTransfer(owner, returnAmount);
        // Penalty stays in contract for governance

        emit EmergencyUnlock(owner, lockId, returnAmount, penalty);
    }

    function _findLockOwner(uint256 lockId) internal view returns (address) {
        return lockOwner[lockId];
    }
}
