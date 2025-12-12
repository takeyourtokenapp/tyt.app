// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/FeeConfig.sol";

contract FeeConfigTest is Test {
    FeeConfig public feeConfig;
    address public admin = address(1);
    address public feeSetter = address(2);
    address public protocol = address(3);
    address public charity = address(4);
    address public academy = address(5);

    bytes32 public constant DEPOSIT_KEY = keccak256("deposit.default");
    bytes32 public constant MARKETPLACE_KEY = keccak256("marketplace.default");

    function setUp() public {
        feeConfig = new FeeConfig(admin, feeSetter);
    }

    function testInitialState() public view {
        assertTrue(feeConfig.hasRole(feeConfig.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(feeConfig.hasRole(feeConfig.FEE_SETTER_ROLE(), feeSetter));
        assertEq(feeConfig.getProfileCount(), 0);
    }

    function testSetFeeProfile() public {
        address[] memory recipients = new address[](3);
        recipients[0] = protocol;
        recipients[1] = charity;
        recipients[2] = academy;

        uint256[] memory splitBps = new uint256[](3);
        splitBps[0] = 6000;
        splitBps[1] = 3000;
        splitBps[2] = 1000;

        vm.prank(feeSetter);
        feeConfig.setFeeProfile(DEPOSIT_KEY, 1000, recipients, splitBps);

        (uint256 totalBps, address[] memory storedRecipients, uint256[] memory storedSplits, bool exists) =
            feeConfig.getFeeProfile(DEPOSIT_KEY);

        assertTrue(exists);
        assertEq(totalBps, 1000);
        assertEq(storedRecipients.length, 3);
        assertEq(storedRecipients[0], protocol);
        assertEq(storedRecipients[1], charity);
        assertEq(storedRecipients[2], academy);
        assertEq(storedSplits[0], 6000);
        assertEq(storedSplits[1], 3000);
        assertEq(storedSplits[2], 1000);
    }

    function testCalculateFeeV3Canonical() public {
        address[] memory recipients = new address[](3);
        recipients[0] = protocol;
        recipients[1] = charity;
        recipients[2] = academy;

        uint256[] memory splitBps = new uint256[](3);
        splitBps[0] = 6000;
        splitBps[1] = 3000;
        splitBps[2] = 1000;

        vm.prank(feeSetter);
        feeConfig.setFeeProfile(DEPOSIT_KEY, 1000, recipients, splitBps);

        uint256 depositAmount = 1000 ether;

        (uint256 feeTotal, address[] memory feeRecipients, uint256[] memory feeAmounts) =
            feeConfig.calculateFee(DEPOSIT_KEY, depositAmount);

        assertEq(feeTotal, 100 ether);
        assertEq(feeAmounts[0], 60 ether);
        assertEq(feeAmounts[1], 30 ether);
        assertEq(feeAmounts[2], 10 ether);

        assertEq(feeRecipients[0], protocol);
        assertEq(feeRecipients[1], charity);
        assertEq(feeRecipients[2], academy);

        uint256 userReceives = depositAmount - feeTotal;
        assertEq(userReceives, 900 ether);
    }

    function testRevertOnInvalidSplitSum() public {
        address[] memory recipients = new address[](3);
        recipients[0] = protocol;
        recipients[1] = charity;
        recipients[2] = academy;

        uint256[] memory splitBps = new uint256[](3);
        splitBps[0] = 5000;
        splitBps[1] = 3000;
        splitBps[2] = 1000;

        vm.prank(feeSetter);
        vm.expectRevert(abi.encodeWithSelector(FeeConfig.SplitSumInvalid.selector, 9000, 10000));
        feeConfig.setFeeProfile(DEPOSIT_KEY, 1000, recipients, splitBps);
    }

    function testRevertOnExceedMaxFee() public {
        address[] memory recipients = new address[](1);
        recipients[0] = protocol;

        uint256[] memory splitBps = new uint256[](1);
        splitBps[0] = 10000;

        vm.prank(feeSetter);
        vm.expectRevert(abi.encodeWithSelector(FeeConfig.InvalidFeeAmount.selector, 2500, 2000));
        feeConfig.setFeeProfile(DEPOSIT_KEY, 2500, recipients, splitBps);
    }

    function testRevertOnZeroAddressRecipient() public {
        address[] memory recipients = new address[](3);
        recipients[0] = protocol;
        recipients[1] = address(0);
        recipients[2] = academy;

        uint256[] memory splitBps = new uint256[](3);
        splitBps[0] = 6000;
        splitBps[1] = 3000;
        splitBps[2] = 1000;

        vm.prank(feeSetter);
        vm.expectRevert(FeeConfig.ZeroAddressRecipient.selector);
        feeConfig.setFeeProfile(DEPOSIT_KEY, 1000, recipients, splitBps);
    }

    function testRevertOnArrayMismatch() public {
        address[] memory recipients = new address[](3);
        recipients[0] = protocol;
        recipients[1] = charity;
        recipients[2] = academy;

        uint256[] memory splitBps = new uint256[](2);
        splitBps[0] = 6000;
        splitBps[1] = 4000;

        vm.prank(feeSetter);
        vm.expectRevert(abi.encodeWithSelector(FeeConfig.ArrayLengthMismatch.selector, 3, 2));
        feeConfig.setFeeProfile(DEPOSIT_KEY, 1000, recipients, splitBps);
    }

    function testRevertOnUnauthorizedSetter() public {
        address[] memory recipients = new address[](1);
        recipients[0] = protocol;

        uint256[] memory splitBps = new uint256[](1);
        splitBps[0] = 10000;

        vm.prank(address(999));
        vm.expectRevert();
        feeConfig.setFeeProfile(DEPOSIT_KEY, 1000, recipients, splitBps);
    }

    function testRevertOnProfileNotFound() public {
        vm.expectRevert(abi.encodeWithSelector(FeeConfig.ProfileNotFound.selector, DEPOSIT_KEY));
        feeConfig.calculateFee(DEPOSIT_KEY, 1000);
    }

    function testRemoveFeeProfile() public {
        address[] memory recipients = new address[](1);
        recipients[0] = protocol;

        uint256[] memory splitBps = new uint256[](1);
        splitBps[0] = 10000;

        vm.prank(feeSetter);
        feeConfig.setFeeProfile(DEPOSIT_KEY, 1000, recipients, splitBps);

        assertTrue(feeConfig.profileExists(DEPOSIT_KEY));

        vm.prank(feeSetter);
        feeConfig.removeFeeProfile(DEPOSIT_KEY);

        assertFalse(feeConfig.profileExists(DEPOSIT_KEY));
    }

    function testProfileKeys() public {
        address[] memory recipients = new address[](1);
        recipients[0] = protocol;

        uint256[] memory splitBps = new uint256[](1);
        splitBps[0] = 10000;

        vm.startPrank(feeSetter);
        feeConfig.setFeeProfile(DEPOSIT_KEY, 1000, recipients, splitBps);
        feeConfig.setFeeProfile(MARKETPLACE_KEY, 500, recipients, splitBps);
        vm.stopPrank();

        bytes32[] memory keys = feeConfig.getProfileKeys();
        assertEq(keys.length, 2);
    }

    function testFuzzCalculateFee(uint256 amount) public {
        vm.assume(amount > 0 && amount < type(uint128).max);

        address[] memory recipients = new address[](3);
        recipients[0] = protocol;
        recipients[1] = charity;
        recipients[2] = academy;

        uint256[] memory splitBps = new uint256[](3);
        splitBps[0] = 6000;
        splitBps[1] = 3000;
        splitBps[2] = 1000;

        vm.prank(feeSetter);
        feeConfig.setFeeProfile(DEPOSIT_KEY, 1000, recipients, splitBps);

        (uint256 feeTotal, , uint256[] memory feeAmounts) = feeConfig.calculateFee(DEPOSIT_KEY, amount);

        assertEq(feeTotal, (amount * 1000) / 10000);

        uint256 sumFees = feeAmounts[0] + feeAmounts[1] + feeAmounts[2];
        assertLe(sumFees, feeTotal);
    }
}
