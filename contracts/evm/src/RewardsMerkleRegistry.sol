// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title RewardsMerkleRegistry
 * @notice TYT v3 Rewards Merkle Registry - Immutable storage of daily reward merkle roots
 * @dev Stores merkle roots by date key (YYYYMMDD format). Once set, roots cannot be overwritten.
 *      Provides on-chain verification of reward claims via merkle proofs.
 */
contract RewardsMerkleRegistry is AccessControl {
    bytes32 public constant REWARDS_PUBLISHER_ROLE = keccak256("REWARDS_PUBLISHER_ROLE");

    struct RewardRoot {
        bytes32 root;
        string dataUri;
        uint256 publishedAt;
        address publishedBy;
        bool exists;
    }

    mapping(uint32 => RewardRoot) private _roots;
    uint32[] private _publishedDates;

    uint256 public totalRootsPublished;

    event RootPublished(
        uint32 indexed dateKey,
        bytes32 indexed root,
        string dataUri,
        address indexed publisher
    );

    error RootAlreadyExists(uint32 dateKey);
    error RootNotFound(uint32 dateKey);
    error InvalidRoot();
    error InvalidDateKey(uint32 dateKey);

    constructor(address admin, address publisher) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REWARDS_PUBLISHER_ROLE, publisher);
    }

    function publishRoot(
        uint32 dateKey,
        bytes32 root,
        string calldata dataUri
    ) external onlyRole(REWARDS_PUBLISHER_ROLE) {
        if (root == bytes32(0)) revert InvalidRoot();
        if (!_isValidDateKey(dateKey)) revert InvalidDateKey(dateKey);
        if (_roots[dateKey].exists) revert RootAlreadyExists(dateKey);

        _roots[dateKey] = RewardRoot({
            root: root,
            dataUri: dataUri,
            publishedAt: block.timestamp,
            publishedBy: msg.sender,
            exists: true
        });

        _publishedDates.push(dateKey);
        totalRootsPublished++;

        emit RootPublished(dateKey, root, dataUri, msg.sender);
    }

    function _isValidDateKey(uint32 dateKey) internal pure returns (bool) {
        uint32 year = dateKey / 10000;
        uint32 month = (dateKey / 100) % 100;
        uint32 day = dateKey % 100;

        if (year < 2024 || year > 2100) return false;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;

        return true;
    }

    function getRoot(uint32 dateKey) external view returns (
        bytes32 root,
        string memory dataUri,
        uint256 publishedAt,
        address publishedBy
    ) {
        RewardRoot storage r = _roots[dateKey];
        if (!r.exists) revert RootNotFound(dateKey);

        return (r.root, r.dataUri, r.publishedAt, r.publishedBy);
    }

    function rootExists(uint32 dateKey) external view returns (bool) {
        return _roots[dateKey].exists;
    }

    function verifyReward(
        uint32 dateKey,
        address user,
        uint256 amount,
        bytes32 asset,
        bytes32[] calldata proof
    ) external view returns (bool) {
        RewardRoot storage r = _roots[dateKey];
        if (!r.exists) revert RootNotFound(dateKey);

        bytes32 leaf = keccak256(
            bytes.concat(
                keccak256(abi.encode(user, dateKey, amount, asset))
            )
        );

        return MerkleProof.verify(proof, r.root, leaf);
    }

    function verifyCustomLeaf(
        uint32 dateKey,
        bytes32 leaf,
        bytes32[] calldata proof
    ) external view returns (bool) {
        RewardRoot storage r = _roots[dateKey];
        if (!r.exists) revert RootNotFound(dateKey);

        return MerkleProof.verify(proof, r.root, leaf);
    }

    function computeLeaf(
        address user,
        uint32 dateKey,
        uint256 amount,
        bytes32 asset
    ) external pure returns (bytes32) {
        return keccak256(
            bytes.concat(
                keccak256(abi.encode(user, dateKey, amount, asset))
            )
        );
    }

    function getPublishedDates() external view returns (uint32[] memory) {
        return _publishedDates;
    }

    function getPublishedDatesCount() external view returns (uint256) {
        return _publishedDates.length;
    }

    function getLatestDateKey() external view returns (uint32) {
        if (_publishedDates.length == 0) return 0;
        return _publishedDates[_publishedDates.length - 1];
    }

    function getDateRange(uint256 start, uint256 count) external view returns (uint32[] memory) {
        if (start >= _publishedDates.length) {
            return new uint32[](0);
        }

        uint256 end = start + count;
        if (end > _publishedDates.length) {
            end = _publishedDates.length;
        }

        uint32[] memory result = new uint32[](end - start);
        for (uint256 i = start; i < end; i++) {
            result[i - start] = _publishedDates[i];
        }

        return result;
    }

    function toDateKey(uint256 year, uint256 month, uint256 day) external pure returns (uint32) {
        return uint32(year * 10000 + month * 100 + day);
    }

    function fromDateKey(uint32 dateKey) external pure returns (
        uint256 year,
        uint256 month,
        uint256 day
    ) {
        year = dateKey / 10000;
        month = (dateKey / 100) % 100;
        day = dateKey % 100;
    }
}
