export const rewardsMerkleABI = [
  {
    type: 'function',
    name: 'claimRewards',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'epoch', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'proof', type: 'bytes32[]' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'hasClaimed',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'epoch', type: 'uint256' }
    ],
    outputs: [{ name: 'claimed', type: 'bool' }]
  },
  {
    type: 'function',
    name: 'currentEpoch',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'epoch', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getMerkleRoot',
    stateMutability: 'view',
    inputs: [{ name: 'epoch', type: 'uint256' }],
    outputs: [{ name: 'root', type: 'bytes32' }]
  },
  {
    type: 'function',
    name: 'setMerkleRoot',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'epoch', type: 'uint256' },
      { name: 'root', type: 'bytes32' }
    ],
    outputs: []
  },
  {
    type: 'event',
    name: 'RewardsClaimed',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'epoch', type: 'uint256', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'MerkleRootSet',
    inputs: [
      { name: 'epoch', type: 'uint256', indexed: true },
      { name: 'root', type: 'bytes32', indexed: false }
    ]
  }
] as const;
