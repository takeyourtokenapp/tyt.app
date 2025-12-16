// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DiscountCurve
 * @notice Library for calculating maintenance fee discounts
 * @dev Implements the TYT discount curve system:
 *      - VIP level discounts (Bronze to Diamond)
 *      - Prepayment discounts (days paid in advance)
 *      - veTYT voting power discounts
 *      - Service button daily discount
 *      Discounts are capped and combine according to TYT tokenomics
 */
library DiscountCurve {
    // Basis points (1 bps = 0.01%)
    uint16 constant MAX_DISCOUNT_BPS = 2000; // 20% max total discount

    // VIP Level Base Discounts (in bps)
    uint16 constant VIP_BRONZE_BPS = 200;    // 2%
    uint16 constant VIP_SILVER_BPS = 500;    // 5%
    uint16 constant VIP_GOLD_BPS = 900;      // 9%
    uint16 constant VIP_PLATINUM_BPS = 1300; // 13%
    uint16 constant VIP_DIAMOND_BPS = 1800;  // 18%

    // Prepayment discount parameters
    uint16 constant PREPAY_MAX_DAYS = 365;
    uint16 constant PREPAY_MAX_BPS = 500;    // 5% max for 1 year prepay

    // veTYT discount parameters
    uint16 constant VETYT_MAX_BPS = 300;     // 3% max from veTYT

    // Service button daily discount
    uint16 constant SERVICE_BUTTON_BPS = 300; // 3% per day (resets daily)

    struct DiscountParams {
        uint16 vipLevel;           // 0-5 (0=None, 1=Bronze, 2=Silver, 3=Gold, 4=Platinum, 5=Diamond)
        uint16 prepayDays;         // 0-365 days
        uint256 veTytPower;        // User's veTYT voting power
        uint256 totalVeTytPower;   // Total veTYT in system
        bool serviceButtonUsed;    // Whether service button used today
    }

    /**
     * @notice Calculate total discount for maintenance payments
     * @param params Discount calculation parameters
     * @return discountBps Total discount in basis points (capped at MAX_DISCOUNT_BPS)
     */
    function computeDiscount(DiscountParams memory params)
        internal
        pure
        returns (uint16 discountBps)
    {
        uint256 totalDiscount = 0;

        // 1. VIP Level Base Discount
        totalDiscount += getVipDiscount(params.vipLevel);

        // 2. Prepayment Discount
        totalDiscount += getPrepayDiscount(params.prepayDays);

        // 3. veTYT Governance Discount
        totalDiscount += getVeTytDiscount(params.veTytPower, params.totalVeTytPower);

        // 4. Service Button Daily Discount
        if (params.serviceButtonUsed) {
            totalDiscount += SERVICE_BUTTON_BPS;
        }

        // Cap at maximum discount
        if (totalDiscount > MAX_DISCOUNT_BPS) {
            totalDiscount = MAX_DISCOUNT_BPS;
        }

        return uint16(totalDiscount);
    }

    /**
     * @notice Get VIP level discount
     * @param vipLevel VIP level (0-5)
     * @return Discount in basis points
     */
    function getVipDiscount(uint16 vipLevel) internal pure returns (uint16) {
        if (vipLevel == 5) return VIP_DIAMOND_BPS;
        if (vipLevel == 4) return VIP_PLATINUM_BPS;
        if (vipLevel == 3) return VIP_GOLD_BPS;
        if (vipLevel == 2) return VIP_SILVER_BPS;
        if (vipLevel == 1) return VIP_BRONZE_BPS;
        return 0;
    }

    /**
     * @notice Get prepayment discount (linear, up to 1 year)
     * @param prepayDays Days paid in advance (0-365)
     * @return Discount in basis points
     */
    function getPrepayDiscount(uint16 prepayDays) internal pure returns (uint16) {
        if (prepayDays == 0) return 0;
        if (prepayDays > PREPAY_MAX_DAYS) prepayDays = PREPAY_MAX_DAYS;

        // Linear: 0 days = 0%, 365 days = 5%
        return uint16((uint256(prepayDays) * PREPAY_MAX_BPS) / PREPAY_MAX_DAYS);
    }

    /**
     * @notice Get veTYT voting power discount
     * @dev Proportional to user's share of total veTYT
     * @param userVeTyt User's veTYT voting power
     * @param totalVeTyt Total veTYT in system
     * @return Discount in basis points
     */
    function getVeTytDiscount(uint256 userVeTyt, uint256 totalVeTyt)
        internal
        pure
        returns (uint16)
    {
        if (userVeTyt == 0 || totalVeTyt == 0) return 0;

        // User's share percentage (scaled by 10000 for bps)
        uint256 sharePercentBps = (userVeTyt * 10000) / totalVeTyt;

        // Scale to max veTYT discount
        // If user has 10% of total veTYT, they get 10% of max discount (0.3%)
        uint256 discount = (sharePercentBps * VETYT_MAX_BPS) / 10000;

        if (discount > VETYT_MAX_BPS) discount = VETYT_MAX_BPS;

        return uint16(discount);
    }

    /**
     * @notice Calculate discount breakdown for display
     * @param params Discount calculation parameters
     * @return vipDiscount VIP level discount
     * @return prepayDiscount Prepayment discount
     * @return veTytDiscount veTYT discount
     * @return serviceDiscount Service button discount
     * @return totalDiscount Total discount (capped)
     */
    function getDiscountBreakdown(DiscountParams memory params)
        internal
        pure
        returns (
            uint16 vipDiscount,
            uint16 prepayDiscount,
            uint16 veTytDiscount,
            uint16 serviceDiscount,
            uint16 totalDiscount
        )
    {
        vipDiscount = getVipDiscount(params.vipLevel);
        prepayDiscount = getPrepayDiscount(params.prepayDays);
        veTytDiscount = getVeTytDiscount(params.veTytPower, params.totalVeTytPower);
        serviceDiscount = params.serviceButtonUsed ? SERVICE_BUTTON_BPS : 0;

        uint256 total = uint256(vipDiscount) + prepayDiscount + veTytDiscount + serviceDiscount;
        if (total > MAX_DISCOUNT_BPS) {
            total = MAX_DISCOUNT_BPS;
        }

        totalDiscount = uint16(total);
    }

    /**
     * @notice Apply discount to a fee amount
     * @param amount Original amount
     * @param discountBps Discount in basis points
     * @return discountedAmount Amount after discount
     * @return discountAmount Discount amount
     */
    function applyDiscount(uint256 amount, uint16 discountBps)
        internal
        pure
        returns (uint256 discountedAmount, uint256 discountAmount)
    {
        if (discountBps == 0) {
            return (amount, 0);
        }

        if (discountBps >= 10000) {
            return (0, amount);
        }

        discountAmount = (amount * discountBps) / 10000;
        discountedAmount = amount - discountAmount;
    }

    /**
     * @notice Calculate required TYT stake for VIP level
     * @dev Based on TYT tokenomics (adjustable via governance)
     * @param vipLevel Target VIP level (1-5)
     * @return Required TYT amount (in wei)
     */
    function getRequiredTytForVip(uint16 vipLevel)
        internal
        pure
        returns (uint256)
    {
        // Example thresholds (should be configurable in production)
        if (vipLevel == 1) return 1000 * 1e18;      // 1,000 TYT for Bronze
        if (vipLevel == 2) return 5000 * 1e18;      // 5,000 TYT for Silver
        if (vipLevel == 3) return 25000 * 1e18;     // 25,000 TYT for Gold
        if (vipLevel == 4) return 100000 * 1e18;    // 100,000 TYT for Platinum
        if (vipLevel == 5) return 500000 * 1e18;    // 500,000 TYT for Diamond
        return 0;
    }

    /**
     * @notice Calculate VIP level from total hashrate
     * @dev Alternative VIP calculation based on mining power
     * @param hashrateTeraHash Total hashrate in TH/s
     * @return vipLevel Calculated VIP level
     */
    function getVipLevelFromHashrate(uint256 hashrateTeraHash)
        internal
        pure
        returns (uint16 vipLevel)
    {
        if (hashrateTeraHash >= 500) return 5;      // Diamond: 500+ TH/s
        if (hashrateTeraHash >= 250) return 4;      // Platinum: 250+ TH/s
        if (hashrateTeraHash >= 100) return 3;      // Gold: 100+ TH/s
        if (hashrateTeraHash >= 50) return 2;       // Silver: 50+ TH/s
        if (hashrateTeraHash >= 10) return 1;       // Bronze: 10+ TH/s
        return 0;                                    // None: <10 TH/s
    }

    /**
     * @notice Get maximum possible discount
     * @return Maximum discount in basis points
     */
    function getMaxDiscount() internal pure returns (uint16) {
        return MAX_DISCOUNT_BPS;
    }

    /**
     * @notice Validate discount parameters
     * @param params Parameters to validate
     * @return valid Whether parameters are valid
     */
    function validateParams(DiscountParams memory params)
        internal
        pure
        returns (bool valid)
    {
        if (params.vipLevel > 5) return false;
        if (params.prepayDays > PREPAY_MAX_DAYS) return false;
        return true;
    }
}
