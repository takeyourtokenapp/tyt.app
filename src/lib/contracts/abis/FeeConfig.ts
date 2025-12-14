export const feeConfigABI = [
  {
    type: 'function',
    name: 'getFeeRecipients',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: 'recipients',
        type: 'tuple',
        components: [
          { name: 'protocol', type: 'address' },
          { name: 'charity', type: 'address' },
          { name: 'academy', type: 'address' }
        ]
      }
    ]
  },
  {
    type: 'function',
    name: 'getFeeShares',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: 'shares',
        type: 'tuple',
        components: [
          { name: 'protocolBps', type: 'uint16' },
          { name: 'charityBps', type: 'uint16' },
          { name: 'academyBps', type: 'uint16' }
        ]
      }
    ]
  },
  {
    type: 'function',
    name: 'getTotalFeeBps',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'bps', type: 'uint16' }]
  },
  {
    type: 'function',
    name: 'setFeeRecipients',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'protocol', type: 'address' },
      { name: 'charity', type: 'address' },
      { name: 'academy', type: 'address' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'setFeeShares',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'protocolBps', type: 'uint16' },
      { name: 'charityBps', type: 'uint16' },
      { name: 'academyBps', type: 'uint16' }
    ],
    outputs: []
  },
  {
    type: 'event',
    name: 'FeeRecipientsUpdated',
    inputs: [
      { name: 'protocol', type: 'address', indexed: true },
      { name: 'charity', type: 'address', indexed: true },
      { name: 'academy', type: 'address', indexed: true }
    ]
  },
  {
    type: 'event',
    name: 'FeeSharesUpdated',
    inputs: [
      { name: 'protocolBps', type: 'uint16', indexed: false },
      { name: 'charityBps', type: 'uint16', indexed: false },
      { name: 'academyBps', type: 'uint16', indexed: false }
    ]
  }
] as const;
