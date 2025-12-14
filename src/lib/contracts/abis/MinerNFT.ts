export const minerNFTABI = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'powerTH', type: 'uint256' },
      { name: 'efficiencyWTH', type: 'uint256' },
      { name: 'region', type: 'string' }
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'upgradePower',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'newPowerTH', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'upgradeEfficiency',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'newEfficiencyWTH', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'ownerOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'owner', type: 'address' }]
  },
  {
    type: 'function',
    name: 'getMinerMetadata',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      {
        name: 'metadata',
        type: 'tuple',
        components: [
          { name: 'powerTH', type: 'uint256' },
          { name: 'efficiencyWTH', type: 'uint256' },
          { name: 'region', type: 'string' },
          { name: 'mintedAt', type: 'uint256' }
        ]
      }
    ]
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'setApprovalForAll',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' }
    ],
    outputs: []
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true }
    ]
  },
  {
    type: 'event',
    name: 'MinerMinted',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'powerTH', type: 'uint256', indexed: false },
      { name: 'efficiencyWTH', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'MinerUpgraded',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'powerTH', type: 'uint256', indexed: false },
      { name: 'efficiencyWTH', type: 'uint256', indexed: false }
    ]
  }
] as const;
