// Mock data for marketplace when database is empty
// This provides realistic demonstration data

export interface MockMiner {
  id: string;
  token_id: string;
  name: string;
  hashrate: number;
  efficiency: number;
  power_level: number;
  maintenance_rate: number;
  farm_id: string;
  purchase_price: number;
  price_currency: string;
  status: string;
  metadata: {
    region: string;
    tier: string;
    color: string;
    edition: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
}

export interface MockListing {
  id: string;
  miner: MockMiner;
  listing_type: 'fixed_price' | 'auction';
  price_amount: number;
  price_currency: string;
  min_bid_amount?: number;
  current_bid_amount?: number;
  auction_end_at?: string;
  status: 'active';
  views_count: number;
  created_at: string;
}

export const mockMiners: MockMiner[] = [
  // Power Level 1 - Common
  {
    id: 'mock-1',
    token_id: 'TYT-MINER-001',
    name: 'Bitcoin Warrior Alpha',
    hashrate: 1.5,
    efficiency: 28.5,
    power_level: 1,
    maintenance_rate: 0.042,
    farm_id: 'FARM-USA-01',
    purchase_price: 450,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'USA', tier: 'Standard', color: 'blue', edition: 'Genesis', rarity: 'common' }
  },
  {
    id: 'mock-2',
    token_id: 'TYT-MINER-002',
    name: 'Satoshi Miner v1',
    hashrate: 1.2,
    efficiency: 30.0,
    power_level: 1,
    maintenance_rate: 0.045,
    farm_id: 'FARM-CAN-01',
    purchase_price: 380,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'Canada', tier: 'Standard', color: 'green', edition: 'Genesis', rarity: 'common' }
  },
  {
    id: 'mock-3',
    token_id: 'TYT-MINER-003',
    name: 'Crypto Digger Basic',
    hashrate: 1.8,
    efficiency: 27.5,
    power_level: 1,
    maintenance_rate: 0.040,
    farm_id: 'FARM-EU-01',
    purchase_price: 520,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'EU', tier: 'Standard', color: 'purple', edition: 'Genesis', rarity: 'common' }
  },
  // Power Level 2 - Rare
  {
    id: 'mock-4',
    token_id: 'TYT-MINER-006',
    name: 'Bitcoin Warrior Beta',
    hashrate: 3.5,
    efficiency: 26.0,
    power_level: 2,
    maintenance_rate: 0.038,
    farm_id: 'FARM-USA-01',
    purchase_price: 1200,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'USA', tier: 'Advanced', color: 'blue', edition: 'Alpha', rarity: 'rare' }
  },
  {
    id: 'mock-5',
    token_id: 'TYT-MINER-007',
    name: 'Satoshi Miner v2 Pro',
    hashrate: 3.2,
    efficiency: 25.5,
    power_level: 2,
    maintenance_rate: 0.037,
    farm_id: 'FARM-CAN-02',
    purchase_price: 1150,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'Canada', tier: 'Advanced', color: 'green', edition: 'Alpha', rarity: 'rare' }
  },
  {
    id: 'mock-6',
    token_id: 'TYT-MINER-009',
    name: 'Hash Hunter S2',
    hashrate: 3.6,
    efficiency: 25.8,
    power_level: 2,
    maintenance_rate: 0.036,
    farm_id: 'FARM-USA-03',
    purchase_price: 1220,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'USA', tier: 'Advanced', color: 'amber', edition: 'Alpha', rarity: 'rare' }
  },
  // Power Level 3 - Epic
  {
    id: 'mock-7',
    token_id: 'TYT-MINER-011',
    name: 'Bitcoin Warrior Gamma',
    hashrate: 7.5,
    efficiency: 23.0,
    power_level: 3,
    maintenance_rate: 0.032,
    farm_id: 'FARM-USA-04',
    purchase_price: 3200,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'USA', tier: 'Expert', color: 'blue', edition: 'Platinum', rarity: 'epic' }
  },
  {
    id: 'mock-8',
    token_id: 'TYT-MINER-013',
    name: 'Crypto Digger Ultra',
    hashrate: 8.0,
    efficiency: 23.5,
    power_level: 3,
    maintenance_rate: 0.033,
    farm_id: 'FARM-EU-03',
    purchase_price: 3400,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'EU', tier: 'Expert', color: 'purple', edition: 'Platinum', rarity: 'epic' }
  },
  {
    id: 'mock-9',
    token_id: 'TYT-MINER-015',
    name: 'BTC Excavator Elite',
    hashrate: 7.6,
    efficiency: 23.2,
    power_level: 3,
    maintenance_rate: 0.032,
    farm_id: 'FARM-ASIA-03',
    purchase_price: 3250,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'Asia', tier: 'Expert', color: 'cyan', edition: 'Platinum', rarity: 'epic' }
  },
  // Power Level 4 - Epic
  {
    id: 'mock-10',
    token_id: 'TYT-MINER-016',
    name: 'Bitcoin Warrior Delta',
    hashrate: 15.0,
    efficiency: 20.0,
    power_level: 4,
    maintenance_rate: 0.028,
    farm_id: 'FARM-USA-06',
    purchase_price: 8500,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'USA', tier: 'Master', color: 'blue', edition: 'Diamond', rarity: 'epic' }
  },
  {
    id: 'mock-11',
    token_id: 'TYT-MINER-018',
    name: 'Crypto Digger Mega',
    hashrate: 16.0,
    efficiency: 20.5,
    power_level: 4,
    maintenance_rate: 0.029,
    farm_id: 'FARM-EU-04',
    purchase_price: 9000,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'EU', tier: 'Master', color: 'purple', edition: 'Diamond', rarity: 'epic' }
  },
  // Power Level 5 - Legendary
  {
    id: 'mock-12',
    token_id: 'TYT-MINER-021',
    name: 'Bitcoin Warrior Omega',
    hashrate: 30.0,
    efficiency: 17.0,
    power_level: 5,
    maintenance_rate: 0.024,
    farm_id: 'FARM-USA-08',
    purchase_price: 22000,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'USA', tier: 'Legendary', color: 'gold', edition: 'Mythic', rarity: 'legendary' }
  },
  {
    id: 'mock-13',
    token_id: 'TYT-MINER-023',
    name: 'Crypto Digger Titan',
    hashrate: 32.0,
    efficiency: 17.5,
    power_level: 5,
    maintenance_rate: 0.025,
    farm_id: 'FARM-EU-05',
    purchase_price: 24000,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'EU', tier: 'Legendary', color: 'gold', edition: 'Mythic', rarity: 'legendary' }
  },
  {
    id: 'mock-14',
    token_id: 'TYT-MINER-024',
    name: 'Hash Hunter S5 Ultimate',
    hashrate: 31.0,
    efficiency: 16.8,
    power_level: 5,
    maintenance_rate: 0.022,
    farm_id: 'FARM-USA-09',
    purchase_price: 23000,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'USA', tier: 'Legendary', color: 'gold', edition: 'Mythic', rarity: 'legendary' }
  },
  // Special Editions
  {
    id: 'mock-15',
    token_id: 'TYT-MINER-026',
    name: 'Thunder Hash TH120',
    hashrate: 12.0,
    efficiency: 21.0,
    power_level: 4,
    maintenance_rate: 0.027,
    farm_id: 'FARM-USA-10',
    purchase_price: 7200,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'USA', tier: 'Master', color: 'electric', edition: 'Storm Series', rarity: 'epic' }
  },
  {
    id: 'mock-16',
    token_id: 'TYT-MINER-027',
    name: 'Arctic Miner A300',
    hashrate: 5.5,
    efficiency: 24.0,
    power_level: 3,
    maintenance_rate: 0.031,
    farm_id: 'FARM-CAN-06',
    purchase_price: 2200,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'Canada', tier: 'Expert', color: 'ice', edition: 'Frost Series', rarity: 'epic' }
  },
  {
    id: 'mock-17',
    token_id: 'TYT-MINER-028',
    name: 'Dragon Hash DH500',
    hashrate: 25.0,
    efficiency: 18.0,
    power_level: 5,
    maintenance_rate: 0.023,
    farm_id: 'FARM-ASIA-06',
    purchase_price: 19000,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'Asia', tier: 'Legendary', color: 'red', edition: 'Dragon Series', rarity: 'legendary' }
  },
  {
    id: 'mock-18',
    token_id: 'TYT-MINER-029',
    name: 'Phoenix Miner PX200',
    hashrate: 4.2,
    efficiency: 25.0,
    power_level: 2,
    maintenance_rate: 0.036,
    farm_id: 'FARM-EU-06',
    purchase_price: 1500,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'EU', tier: 'Advanced', color: 'orange', edition: 'Fire Series', rarity: 'rare' }
  },
  {
    id: 'mock-19',
    token_id: 'TYT-MINER-030',
    name: 'Storm Breaker SB150',
    hashrate: 9.0,
    efficiency: 22.0,
    power_level: 3,
    maintenance_rate: 0.030,
    farm_id: 'FARM-USA-11',
    purchase_price: 4500,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'USA', tier: 'Expert', color: 'lightning', edition: 'Storm Series', rarity: 'epic' }
  },
  {
    id: 'mock-20',
    token_id: 'TYT-MINER-031',
    name: 'Quantum Hasher QH777',
    hashrate: 20.0,
    efficiency: 19.0,
    power_level: 4,
    maintenance_rate: 0.026,
    farm_id: 'FARM-USA-12',
    purchase_price: 12000,
    price_currency: 'TYT',
    status: 'active',
    metadata: { region: 'USA', tier: 'Master', color: 'quantum', edition: 'Quantum Series', rarity: 'epic' }
  }
];

// Create listings from miners
export const mockListings: MockListing[] = [
  // Fixed price listings
  {
    id: 'list-1',
    miner: mockMiners[1], // Satoshi Miner v1
    listing_type: 'fixed_price',
    price_amount: 437,
    price_currency: 'TYT',
    status: 'active',
    views_count: 142,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'list-2',
    miner: mockMiners[3], // Bitcoin Warrior Beta
    listing_type: 'fixed_price',
    price_amount: 1380,
    price_currency: 'TYT',
    status: 'active',
    views_count: 267,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'list-3',
    miner: mockMiners[5], // Hash Hunter S2
    listing_type: 'fixed_price',
    price_amount: 1403,
    price_currency: 'TYT',
    status: 'active',
    views_count: 189,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'list-4',
    miner: mockMiners[8], // BTC Excavator Elite
    listing_type: 'fixed_price',
    price_amount: 3738,
    price_currency: 'TYT',
    status: 'active',
    views_count: 324,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'list-5',
    miner: mockMiners[14], // Thunder Hash TH120
    listing_type: 'fixed_price',
    price_amount: 8280,
    price_currency: 'TYT',
    status: 'active',
    views_count: 412,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'list-6',
    miner: mockMiners[15], // Arctic Miner A300
    listing_type: 'fixed_price',
    price_amount: 2530,
    price_currency: 'TYT',
    status: 'active',
    views_count: 298,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'list-7',
    miner: mockMiners[17], // Phoenix Miner PX200
    listing_type: 'fixed_price',
    price_amount: 1725,
    price_currency: 'TYT',
    status: 'active',
    views_count: 156,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 'list-8',
    miner: mockMiners[19], // Storm Breaker SB150
    listing_type: 'fixed_price',
    price_amount: 5175,
    price_currency: 'TYT',
    status: 'active',
    views_count: 387,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  // Auction listings
  {
    id: 'list-9',
    miner: mockMiners[6], // Bitcoin Warrior Gamma
    listing_type: 'auction',
    price_amount: 4000, // Reserve
    price_currency: 'TYT',
    min_bid_amount: 2400,
    current_bid_amount: 3520,
    auction_end_at: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'active',
    views_count: 542,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'list-10',
    miner: mockMiners[7], // Crypto Digger Ultra
    listing_type: 'auction',
    price_amount: 4250,
    price_currency: 'TYT',
    min_bid_amount: 2550,
    current_bid_amount: 3740,
    auction_end_at: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: 'active',
    views_count: 623,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'list-11',
    miner: mockMiners[9], // Bitcoin Warrior Delta
    listing_type: 'auction',
    price_amount: 10625,
    price_currency: 'TYT',
    min_bid_amount: 6375,
    current_bid_amount: 9350,
    auction_end_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'active',
    views_count: 834,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'list-12',
    miner: mockMiners[11], // Bitcoin Warrior Omega
    listing_type: 'auction',
    price_amount: 27500,
    price_currency: 'TYT',
    min_bid_amount: 16500,
    current_bid_amount: 24200,
    auction_end_at: new Date(Date.now() + 86400000 * 4).toISOString(),
    status: 'active',
    views_count: 1247,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'list-13',
    miner: mockMiners[12], // Crypto Digger Titan
    listing_type: 'auction',
    price_amount: 30000,
    price_currency: 'TYT',
    min_bid_amount: 18000,
    current_bid_amount: 26400,
    auction_end_at: new Date(Date.now() + 86400000 * 6).toISOString(),
    status: 'active',
    views_count: 1456,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'list-14',
    miner: mockMiners[16], // Dragon Hash DH500
    listing_type: 'auction',
    price_amount: 23750,
    price_currency: 'TYT',
    min_bid_amount: 14250,
    current_bid_amount: 20900,
    auction_end_at: new Date(Date.now() + 86400000 * 7).toISOString(),
    status: 'active',
    views_count: 1123,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export function getMockListings(): MockListing[] {
  return mockListings;
}

export function getMockMiners(): MockMiner[] {
  return mockMiners;
}
