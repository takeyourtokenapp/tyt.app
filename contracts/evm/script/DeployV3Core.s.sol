// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/FeeConfig.sol";
import "../src/CharityVault.sol";
import "../src/MinerNFT.sol";
import "../src/RewardsMerkleRegistry.sol";
import "../src/MinerMarketplace.sol";

/**
 * @title DeployV3Core
 * @notice Deployment script for TYT v3 core contracts
 * @dev Deploy order: FeeConfig -> CharityVault -> MinerNFT -> RewardsMerkleRegistry -> MinerMarketplace
 */
contract DeployV3Core is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address admin = vm.envAddress("ADMIN_ADDRESS");
        address treasury = vm.envAddress("TREASURY_MULTISIG");
        address protocolTreasury = vm.envAddress("PROTOCOL_TREASURY");
        address charityTreasury = vm.envAddress("CHARITY_TREASURY");
        address academyTreasury = vm.envAddress("ACADEMY_TREASURY");
        address feeSetter = vm.envAddress("FEE_SETTER_ADMIN");
        address rewardsPublisher = vm.envAddress("REWARDS_PUBLISHER");

        vm.startBroadcast(deployerPrivateKey);

        FeeConfig feeConfig = new FeeConfig(admin, feeSetter);
        console.log("FeeConfig deployed at:", address(feeConfig));

        CharityVault charityVault = new CharityVault(treasury);
        console.log("CharityVault deployed at:", address(charityVault));

        MinerNFT minerNFT = new MinerNFT(
            "TYT Miner",
            "TYTM",
            "https://api.takeyourtoken.app/metadata/miners/",
            admin
        );
        console.log("MinerNFT deployed at:", address(minerNFT));

        RewardsMerkleRegistry rewardsRegistry = new RewardsMerkleRegistry(admin, rewardsPublisher);
        console.log("RewardsMerkleRegistry deployed at:", address(rewardsRegistry));

        bytes32 marketplaceFeeKey = keccak256("marketplace.default");

        address[] memory recipients = new address[](3);
        recipients[0] = protocolTreasury;
        recipients[1] = charityTreasury;
        recipients[2] = academyTreasury;

        uint256[] memory splitBps = new uint256[](3);
        splitBps[0] = 6000;
        splitBps[1] = 3000;
        splitBps[2] = 1000;

        feeConfig.setFeeProfile(marketplaceFeeKey, 500, recipients, splitBps);
        console.log("Marketplace fee profile set: 5% total, 60/30/10 split");

        bytes32 depositFeeKey = keccak256("deposit.default");
        feeConfig.setFeeProfile(depositFeeKey, 1000, recipients, splitBps);
        console.log("Deposit fee profile set: 10% total, 60/30/10 split");

        MinerMarketplace marketplace = new MinerMarketplace(
            address(feeConfig),
            address(minerNFT),
            marketplaceFeeKey,
            admin
        );
        console.log("MinerMarketplace deployed at:", address(marketplace));

        charityVault.grantRole(charityVault.DEPOSITOR_ROLE(), address(marketplace));
        console.log("Marketplace granted DEPOSITOR_ROLE on CharityVault");

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("FeeConfig:", address(feeConfig));
        console.log("CharityVault:", address(charityVault));
        console.log("MinerNFT:", address(minerNFT));
        console.log("RewardsMerkleRegistry:", address(rewardsRegistry));
        console.log("MinerMarketplace:", address(marketplace));
    }
}
