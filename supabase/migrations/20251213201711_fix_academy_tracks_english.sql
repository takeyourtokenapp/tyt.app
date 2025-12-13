/*
  # Fix Academy Tracks - English Version
  
  Replaces Russian tracks with proper English tracks that lessons reference
*/

-- Delete old Russian tracks first (cascade will handle lessons)
DELETE FROM academy_tracks WHERE slug IN ('foundations', 'bitcoin-mining', 'nft-miners', 'multi-chain', 'security', 'compliance');

-- Insert proper English tracks
INSERT INTO academy_tracks (slug, title, description, display_order, difficulty_level, estimated_hours, completion_xp, icon, color, is_published) VALUES
('foundations', 'Crypto Foundations', 'Introduction to blockchain, wallets, and transactions. Perfect for beginners.', 1, 1, 3, 50, 'BookOpen', '#3B82F6', true),
('mining-essentials', 'Mining Essentials', 'How Bitcoin works, proof-of-work, hashrate, and mining pools.', 2, 1, 4, 75, 'Cpu', '#F59E0B', true),
('tyt-platform', 'TYT Platform Mastery', 'NFT miners, marketplace, rewards, and maintenance systems.', 3, 2, 3, 60, 'Boxes', '#8B5CF6', true),
('multi-chain', 'Multi-Chain Ecosystems', 'BTC, ETH, SOL, TRON, TON - differences and opportunities.', 4, 2, 5, 100, 'Network', '#10B981', true),
('risk-compliance', 'Risk & Compliance', 'Security, KYC/AML, taxes, and legal status of cryptocurrencies.', 5, 3, 4, 80, 'Shield', '#EF4444', true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  difficulty_level = EXCLUDED.difficulty_level,
  is_published = true;

COMMENT ON TABLE academy_tracks IS 'Learning tracks for academy - now in English';
