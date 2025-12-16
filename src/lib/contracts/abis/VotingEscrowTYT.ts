export const votingEscrowTYTABI = [
  {
    type: 'constructor',
    inputs: [{ name: '_tytToken', type: 'address' }]
  },
  {
    type: 'function',
    name: 'createLock',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'duration', type: 'uint256' }
    ],
    outputs: [{ name: 'lockId', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'increaseAmount',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'lockId', type: 'uint256' },
      { name: 'addedAmount', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'increaseDuration',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'lockId', type: 'uint256' },
      { name: 'addedDuration', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'withdraw',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'lockId', type: 'uint256' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'getVotingPower',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getUserLocks',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }]
  },
  {
    type: 'function',
    name: 'getLockInfo',
    stateMutability: 'view',
    inputs: [{ name: 'lockId', type: 'uint256' }],
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'start', type: 'uint256' },
      { name: 'end', type: 'uint256' },
      { name: 'votingPower', type: 'uint256' },
      { name: 'withdrawn', type: 'bool' }
    ]
  },
  {
    type: 'function',
    name: 'locks',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'start', type: 'uint256' },
      { name: 'end', type: 'uint256' },
      { name: 'votingPower', type: 'uint256' },
      { name: 'withdrawn', type: 'bool' }
    ]
  },
  {
    type: 'function',
    name: 'userVotingPower',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'totalVotingPower',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'tytToken',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    type: 'function',
    name: 'MIN_LOCK_DURATION',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'MAX_LOCK_DURATION',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'event',
    name: 'LockCreated',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'lockId', type: 'uint256', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'duration', type: 'uint256', indexed: false },
      { name: 'votingPower', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'LockIncreased',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'lockId', type: 'uint256', indexed: true },
      { name: 'addedAmount', type: 'uint256', indexed: false },
      { name: 'newVotingPower', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'LockExtended',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'lockId', type: 'uint256', indexed: true },
      { name: 'newEnd', type: 'uint256', indexed: false },
      { name: 'newVotingPower', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'LockWithdrawn',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'lockId', type: 'uint256', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ]
  }
] as const;
