// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/FeeConfigGovernance.sol";
import "../src/MinerNFT.sol";
import "../src/MinerMarketplace.sol";
import "../src/RewardsMerkleRegistry.sol";
import "../src/CharityVault.sol";
import "../src/AcademyVault.sol";
import "../src/VotingEscrowTYT.sol";

/**
 * @title DeployComplete
 * @notice Complete TYT v3 deployment with all contracts including veTYT governance
 * @dev Deploys all core contracts + governance system
 *
 * Architecture:
 * - MinerNFT: ERC-721 miners with hashrate, efficiency, upgrades
 * - Marketplace: P2P trading of miners
 * - RewardsMerkle: Daily BTC reward proofs
 * - CharityVault: Children's Brain Cancer Foundation treasury
 * - AcademyVault: Digital Academy rewards fund
 * - FeeConfig: 60/30/10 fee distribution governance
 * - VotingEscrowTYT: Time-locked governance voting
 *
 * Usage:
 * forge script script/DeployComplete.s.sol:DeployComplete \
 *   --rpc-url $POLYGON_AMOY_RPC \
 *   --private-key $PRIVATE_KEY \
 *   --broadcast \
 *   --verify \
 *   -vvvv
 */
contract DeployComplete is Script {
    // Deployment addresses
    address public deployer;
    address public protocolTreasury;
    address public admin;
    address public tytTokenAddress; // TYT token on this chain (bridged or wrapped)

    // Contract instances
    FeeConfigGovernance public feeConfig;
    CharityVault public charityVault;
    AcademyVault public academyVault;
    MinerNFT public minerNFT;
    MinerMarketplace public marketplace;
    RewardsMerkleRegistry public rewardsRegistry;
    VotingEscrowTYT public veTYT;

    // Constants
    uint256 public constant MINER_MINT_PRICE = 0.1 ether;

    function run() external {
        // Get deployer from private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        deployer = vm.addr(deployerPrivateKey);

        // Set addresses (can be overridden by environment variables)
        admin = vm.envOr("ADMIN_ADDRESS", deployer);
        protocolTreasury = vm.envOr("PROTOCOL_TREASURY", deployer);
        tytTokenAddress = vm.envOr("TYT_TOKEN_ADDRESS", address(0));

        require(tytTokenAddress != address(0), "TYT_TOKEN_ADDRESS must be set");

        console.log("=== TYT v3 Complete Deployment ===");
        console.log("Deployer:", deployer);
        console.log("Admin:", admin);
        console.log("Protocol Treasury:", protocolTreasury);
        console.log("TYT Token:", tytTokenAddress);
        console.log("Chain ID:", block.chainid);
        console.log("");

        vm.startBroadcast(deployerPrivateKey);

        // ================================================
        // STEP 1: Deploy Vaults
        // ================================================
        console.log("1. Deploying Vaults...");

        charityVault = new CharityVault(admin, admin);
        console.log("   CharityVault:", address(charityVault));

        academyVault = new AcademyVault(admin, admin);
        console.log("   AcademyVault:", address(academyVault));
        console.log("");

        // ================================================
        // STEP 2: Deploy FeeConfig Governance
        // ================================================
        console.log("2. Deploying FeeConfig Governance...");
        feeConfig = new FeeConfigGovernance(
            admin,
            protocolTreasury,
            address(charityVault),
            address(academyVault)
        );
        console.log("   FeeConfigGovernance:", address(feeConfig));
        console.log("");

        // ================================================
        // STEP 3: Deploy Core NFT System
        // ================================================
        console.log("3. Deploying MinerNFT...");
        minerNFT = new MinerNFT(
            "TYT Digital Miner",
            "TYTM",
            "https://api.takeyourtoken.app/metadata/miners/",
            admin,
            address(feeConfig),
            MINER_MINT_PRICE
        );
        console.log("   MinerNFT:", address(minerNFT));
        console.log("");

        // ================================================
        // STEP 4: Deploy Marketplace
        // ================================================
        console.log("4. Deploying MinerMarketplace...");
        marketplace = new MinerMarketplace(
            address(feeConfig),
            address(minerNFT),
            admin
        );
        console.log("   MinerMarketplace:", address(marketplace));
        console.log("");

        // ================================================
        // STEP 5: Deploy Rewards Registry
        // ================================================
        console.log("5. Deploying RewardsMerkleRegistry...");
        rewardsRegistry = new RewardsMerkleRegistry(admin);
        console.log("   RewardsMerkleRegistry:", address(rewardsRegistry));
        console.log("");

        // ================================================
        // STEP 6: Deploy veTYT Governance
        // ================================================
        console.log("6. Deploying VotingEscrowTYT (veTYT)...");
        veTYT = new VotingEscrowTYT(tytTokenAddress);
        console.log("   VotingEscrowTYT:", address(veTYT));
        console.log("   TYT Token:", tytTokenAddress);
        console.log("   Min Lock:", veTYT.MIN_LOCK_DURATION() / 1 days, "days");
        console.log("   Max Lock:", veTYT.MAX_LOCK_DURATION() / 365 days, "years");
        console.log("");

        // ================================================
        // STEP 7: Setup Permissions
        // ================================================
        console.log("7. Setting up permissions...");

        // Grant admin roles where needed
        // MinerNFT: admin already has DEFAULT_ADMIN_ROLE
        // Marketplace: admin already has DEFAULT_ADMIN_ROLE
        // veTYT: admin already has DEFAULT_ADMIN_ROLE

        console.log("   Permissions configured");
        console.log("");

        // ================================================
        // STEP 8: Deployment Summary
        // ================================================
        console.log("=== Deployment Summary ===");
        console.log("Network:", getNetworkName());
        console.log("Deployer:", deployer);
        console.log("");
        console.log("Core Contracts:");
        console.log("  MinerNFT:", address(minerNFT));
        console.log("  MinerMarketplace:", address(marketplace));
        console.log("  RewardsMerkleRegistry:", address(rewardsRegistry));
        console.log("");
        console.log("Governance:");
        console.log("  FeeConfigGovernance:", address(feeConfig));
        console.log("  VotingEscrowTYT:", address(veTYT));
        console.log("");
        console.log("Vaults:");
        console.log("  CharityVault:", address(charityVault));
        console.log("  AcademyVault:", address(academyVault));
        console.log("");
        console.log("Token:");
        console.log("  TYT Token:", tytTokenAddress);
        console.log("");

        // ================================================
        // STEP 9: Save Deployment Addresses
        // ================================================
        console.log("Saving deployment addresses...");
        saveDeploymentAddresses();
        console.log("");

        vm.stopBroadcast();

        // ================================================
        // STEP 10: Next Steps
        // ================================================
        console.log("=== Deployment Complete ===");
        console.log("");
        console.log("Next Steps:");
        console.log("1. Update .env with contract addresses:");
        console.log("   VITE_CONTRACT_FEE_CONFIG=", address(feeConfig));
        console.log("   VITE_CONTRACT_CHARITY_VAULT=", address(charityVault));
        console.log("   VITE_CONTRACT_ACADEMY_VAULT=", address(academyVault));
        console.log("   VITE_CONTRACT_MINER_NFT=", address(minerNFT));
        console.log("   VITE_CONTRACT_MARKETPLACE=", address(marketplace));
        console.log("   VITE_CONTRACT_REWARDS_MERKLE=", address(rewardsRegistry));
        console.log("   VITE_CONTRACT_VETYT=", address(veTYT));
        console.log("");
        console.log("2. Verify contracts on PolygonScan");
        console.log("3. Test minting, trading, and governance");
        console.log("4. Configure Oracle role for rewards registry");
        console.log("5. Set up automated reward distribution");
        console.log("");
    }

    function saveDeploymentAddresses() internal {
        string memory json = "deployment";

        vm.serializeAddress(json, "feeConfig", address(feeConfig));
        vm.serializeAddress(json, "charityVault", address(charityVault));
        vm.serializeAddress(json, "academyVault", address(academyVault));
        vm.serializeAddress(json, "minerNFT", address(minerNFT));
        vm.serializeAddress(json, "marketplace", address(marketplace));
        vm.serializeAddress(json, "rewardsRegistry", address(rewardsRegistry));
        vm.serializeAddress(json, "veTYT", address(veTYT));
        vm.serializeAddress(json, "tytToken", tytTokenAddress);

        string memory finalJson = vm.serializeAddress(json, "deployer", deployer);

        string memory networkName = getNetworkName();
        string memory fileName = string.concat("deployments/", networkName, ".json");
        vm.writeJson(finalJson, fileName);

        console.log("  Saved to:", fileName);
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
