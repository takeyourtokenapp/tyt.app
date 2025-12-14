// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/FeeConfigGovernance.sol";
import "../src/MinerNFT.sol";
import "../src/MinerMarketplace.sol";
import "../src/RewardsMerkleRegistry.sol";
import "../src/CharityVault.sol";
import "../src/AcademyVault.sol";

/**
 * @title DeployV3WithFeeConfig
 * @notice Complete TYT v3 deployment script with 60/30/10 fee distribution
 * @dev Deploys all core contracts with integrated fee system
 *
 * Fee Structure:
 * - Protocol Treasury: 60% (operations, development, liquidity)
 * - Children's Brain Cancer Foundation: 30% (research, grants, support)
 * - Digital Academy: 10% (education, content, rewards)
 *
 * Usage:
 * forge script script/DeployV3WithFeeConfig.s.sol:DeployV3WithFeeConfig \
 *   --rpc-url $RPC_URL \
 *   --broadcast \
 *   --verify \
 *   -vvvv
 */
contract DeployV3WithFeeConfig is Script {
    // Deployment addresses (will be set by deployer)
    address public deployer;
    address public protocolTreasury;
    address public admin;

    // Contract instances
    FeeConfigGovernance public feeConfig;
    CharityVault public charityVault;
    AcademyVault public academyVault;
    MinerNFT public minerNFT;
    MinerMarketplace public marketplace;
    RewardsMerkleRegistry public rewardsRegistry;

    // Constants
    uint256 public constant MINER_MINT_PRICE = 0.1 ether; // 0.1 MATIC

    function run() external {
        // Get deployer from private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        deployer = vm.addr(deployerPrivateKey);

        // Set addresses (can be overridden by environment variables)
        admin = vm.envOr("ADMIN_ADDRESS", deployer);
        protocolTreasury = vm.envOr("PROTOCOL_TREASURY", deployer);

        console.log("=== TYT v3 Deployment with Fee Config ===");
        console.log("Deployer:", deployer);
        console.log("Admin:", admin);
        console.log("Protocol Treasury:", protocolTreasury);
        console.log("");

        vm.startBroadcast(deployerPrivateKey);

        // ================================================
        // STEP 1: Deploy CharityVault
        // ================================================
        console.log("1. Deploying CharityVault...");
        charityVault = new CharityVault(admin, admin);
        console.log("   CharityVault deployed at:", address(charityVault));
        console.log("");

        // ================================================
        // STEP 2: Deploy AcademyVault
        // ================================================
        console.log("2. Deploying AcademyVault...");
        academyVault = new AcademyVault(admin, admin);
        console.log("   AcademyVault deployed at:", address(academyVault));
        console.log("");

        // ================================================
        // STEP 3: Deploy FeeConfigGovernance
        // ================================================
        console.log("3. Deploying FeeConfigGovernance...");
        feeConfig = new FeeConfigGovernance(
            admin,
            protocolTreasury,
            address(charityVault),
            address(academyVault)
        );
        console.log("   FeeConfigGovernance deployed at:", address(feeConfig));
        console.log("");

        // Verify default profiles
        console.log("   Verifying default fee profiles:");
        verifyFeeProfile(feeConfig.DEPOSIT_KEY(), "Deposit");
        verifyFeeProfile(feeConfig.MARKETPLACE_KEY(), "Marketplace");
        verifyFeeProfile(feeConfig.WITHDRAWAL_KEY(), "Withdrawal");
        verifyFeeProfile(feeConfig.MAINTENANCE_KEY(), "Maintenance");
        verifyFeeProfile(feeConfig.MINT_KEY(), "Mint");
        console.log("");

        // ================================================
        // STEP 4: Deploy MinerNFT
        // ================================================
        console.log("4. Deploying MinerNFT...");
        minerNFT = new MinerNFT(
            "TYT Miner",
            "TYTM",
            "https://api.tyt.app/metadata/miners/", // Base URI
            admin,
            address(feeConfig),
            MINER_MINT_PRICE
        );
        console.log("   MinerNFT deployed at:", address(minerNFT));
        console.log("   Mint price:", MINER_MINT_PRICE);
        console.log("");

        // ================================================
        // STEP 5: Deploy MinerMarketplace
        // ================================================
        console.log("5. Deploying MinerMarketplace...");
        marketplace = new MinerMarketplace(
            address(feeConfig),
            address(minerNFT),
            admin
        );
        console.log("   MinerMarketplace deployed at:", address(marketplace));
        console.log("");

        // ================================================
        // STEP 6: Deploy RewardsMerkleRegistry
        // ================================================
        console.log("6. Deploying RewardsMerkleRegistry...");
        rewardsRegistry = new RewardsMerkleRegistry(admin);
        console.log("   RewardsMerkleRegistry deployed at:", address(rewardsRegistry));
        console.log("");

        // ================================================
        // STEP 7: Setup Permissions
        // ================================================
        console.log("7. Setting up permissions...");

        // Grant marketplace approval for MinerNFT transfers
        console.log("   Granting marketplace MINTER_ROLE...");
        // Note: Marketplace doesn't need MINTER_ROLE, users interact directly

        console.log("");

        // ================================================
        // STEP 8: Verification & Summary
        // ================================================
        console.log("8. Deployment Summary:");
        console.log("   -----------------------------------");
        console.log("   FeeConfigGovernance:", address(feeConfig));
        console.log("   CharityVault:", address(charityVault));
        console.log("   AcademyVault:", address(academyVault));
        console.log("   MinerNFT:", address(minerNFT));
        console.log("   MinerMarketplace:", address(marketplace));
        console.log("   RewardsMerkleRegistry:", address(rewardsRegistry));
        console.log("   -----------------------------------");
        console.log("");

        // ================================================
        // STEP 9: Save Deployment Addresses
        // ================================================
        console.log("9. Saving deployment addresses...");
        saveDeploymentAddresses();
        console.log("");

        vm.stopBroadcast();

        console.log("=== Deployment Complete ===");
        console.log("");
        console.log("Next steps:");
        console.log("1. Update frontend .env with contract addresses");
        console.log("2. Verify contracts on block explorer");
        console.log("3. Test mint, marketplace, and fee distribution");
        console.log("4. Configure governance timelock if needed");
        console.log("");
    }

    function verifyFeeProfile(bytes32 key, string memory name) internal view {
        FeeConfigGovernance.FeeProfile memory profile = feeConfig.getFeeProfile(key);

        console.log("   -", name, "Profile:");
        console.log("     Total Fee:", profile.totalBps, "bps");
        console.log("     Protocol:", profile.protocolSplitBps, "bps ->", profile.protocolTreasury);
        console.log("     Charity:", profile.charitySplitBps, "bps ->", profile.charityVault);
        console.log("     Academy:", profile.academySplitBps, "bps ->", profile.academyVault);
    }

    function saveDeploymentAddresses() internal {
        string memory json = "deployment";

        vm.serializeAddress(json, "feeConfig", address(feeConfig));
        vm.serializeAddress(json, "charityVault", address(charityVault));
        vm.serializeAddress(json, "academyVault", address(academyVault));
        vm.serializeAddress(json, "minerNFT", address(minerNFT));
        vm.serializeAddress(json, "marketplace", address(marketplace));
        vm.serializeAddress(json, "rewardsRegistry", address(rewardsRegistry));

        string memory finalJson = vm.serializeAddress(json, "deployer", deployer);

        // Determine network name
        string memory networkName = getNetworkName();

        // Save to file
        string memory fileName = string.concat("deployments/", networkName, ".json");
        vm.writeJson(finalJson, fileName);

        console.log("   Deployment addresses saved to:", fileName);
    }

    function getNetworkName() internal view returns (string memory) {
        uint256 chainId = block.chainid;

        if (chainId == 1) return "mainnet";
        if (chainId == 137) return "polygon";
        if (chainId == 80002) return "amoy";
        if (chainId == 11155111) return "sepolia";
        if (chainId == 43114) return "avalanche";
        if (chainId == 56) return "bsc";
        if (chainId == 42161) return "arbitrum";
        if (chainId == 10) return "optimism";

        return string.concat("chain-", vm.toString(chainId));
    }
}
