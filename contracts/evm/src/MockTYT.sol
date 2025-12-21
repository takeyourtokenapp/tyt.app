// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockTYT
 * @notice Mock TYT token for testing on Polygon Amoy testnet
 * @dev This is a test token only - DO NOT use in production!
 *
 * Features:
 * - Anyone can mint (for testing)
 * - Burnable
 * - 18 decimals
 * - 1 billion initial supply
 */
contract MockTYT is ERC20, ERC20Burnable, Ownable {

    /// @notice Maximum supply cap (10 billion tokens)
    uint256 public constant MAX_SUPPLY = 10_000_000_000 * 10**18;

    /// @notice Emitted when tokens are minted
    event TokensMinted(address indexed to, uint256 amount);

    /**
     * @notice Constructor - mints initial supply to deployer
     */
    constructor() ERC20("Take Your Token", "TYT") Ownable(msg.sender) {
        // Mint 1 billion tokens to deployer
        _mint(msg.sender, 1_000_000_000 * 10**18);
    }

    /**
     * @notice Mint tokens to address (testnet only!)
     * @param to Address to mint to
     * @param amount Amount to mint (in wei, 18 decimals)
     */
    function mint(address to, uint256 amount) external {
        require(to != address(0), "MockTYT: mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "MockTYT: max supply exceeded");

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @notice Mint tokens to multiple addresses
     * @param recipients Array of addresses
     * @param amounts Array of amounts
     */
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) external {
        require(recipients.length == amounts.length, "MockTYT: length mismatch");
        require(recipients.length <= 100, "MockTYT: too many recipients");

        for (uint256 i = 0; i < recipients.length; i++) {
            mint(recipients[i], amounts[i]);
        }
    }

    /**
     * @notice Get token info
     */
    function getTokenInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 tokenTotalSupply,
        uint256 maxSupply
    ) {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply(),
            MAX_SUPPLY
        );
    }
}
