export const discountCurveABI = [
  {
    type: 'function',
    name: 'computeDiscount',
    stateMutability: 'pure',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'vipLevel', type: 'uint16' },
          { name: 'prepayDays', type: 'uint16' },
          { name: 'veTytPower', type: 'uint256' },
          { name: 'totalVeTytPower', type: 'uint256' },
          { name: 'serviceButtonUsed', type: 'bool' }
        ]
      }
    ],
    outputs: [{ name: 'discountBps', type: 'uint16' }]
  },
  {
    type: 'function',
    name: 'getVipDiscount',
    stateMutability: 'pure',
    inputs: [{ name: 'vipLevel', type: 'uint16' }],
    outputs: [{ name: '', type: 'uint16' }]
  },
  {
    type: 'function',
    name: 'getPrepayDiscount',
    stateMutability: 'pure',
    inputs: [{ name: 'prepayDays', type: 'uint16' }],
    outputs: [{ name: '', type: 'uint16' }]
  },
  {
    type: 'function',
    name: 'getVeTytDiscount',
    stateMutability: 'pure',
    inputs: [
      { name: 'userVeTyt', type: 'uint256' },
      { name: 'totalVeTyt', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint16' }]
  },
  {
    type: 'function',
    name: 'getDiscountBreakdown',
    stateMutability: 'pure',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'vipLevel', type: 'uint16' },
          { name: 'prepayDays', type: 'uint16' },
          { name: 'veTytPower', type: 'uint256' },
          { name: 'totalVeTytPower', type: 'uint256' },
          { name: 'serviceButtonUsed', type: 'bool' }
        ]
      }
    ],
    outputs: [
      { name: 'vipDiscount', type: 'uint16' },
      { name: 'prepayDiscount', type: 'uint16' },
      { name: 'veTytDiscount', type: 'uint16' },
      { name: 'serviceDiscount', type: 'uint16' },
      { name: 'totalDiscount', type: 'uint16' }
    ]
  },
  {
    type: 'function',
    name: 'applyDiscount',
    stateMutability: 'pure',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'discountBps', type: 'uint16' }
    ],
    outputs: [
      { name: 'discountedAmount', type: 'uint256' },
      { name: 'discountAmount', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'getRequiredTytForVip',
    stateMutability: 'pure',
    inputs: [{ name: 'vipLevel', type: 'uint16' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getVipLevelFromHashrate',
    stateMutability: 'pure',
    inputs: [{ name: 'hashrateTeraHash', type: 'uint256' }],
    outputs: [{ name: 'vipLevel', type: 'uint16' }]
  },
  {
    type: 'function',
    name: 'getMaxDiscount',
    stateMutability: 'pure',
    inputs: [],
    outputs: [{ name: '', type: 'uint16' }]
  },
  {
    type: 'function',
    name: 'validateParams',
    stateMutability: 'pure',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'vipLevel', type: 'uint16' },
          { name: 'prepayDays', type: 'uint16' },
          { name: 'veTytPower', type: 'uint256' },
          { name: 'totalVeTytPower', type: 'uint256' },
          { name: 'serviceButtonUsed', type: 'bool' }
        ]
      }
    ],
    outputs: [{ name: 'valid', type: 'bool' }]
  }
] as const;

// Constants from the library
export const DISCOUNT_CONSTANTS = {
  MAX_DISCOUNT_BPS: 2000, // 20%
  VIP_BRONZE_BPS: 200, // 2%
  VIP_SILVER_BPS: 500, // 5%
  VIP_GOLD_BPS: 900, // 9%
  VIP_PLATINUM_BPS: 1300, // 13%
  VIP_DIAMOND_BPS: 1800, // 18%
  PREPAY_MAX_DAYS: 365,
  PREPAY_MAX_BPS: 500, // 5%
  VETYT_MAX_BPS: 300, // 3%
  SERVICE_BUTTON_BPS: 300 // 3%
} as const;
