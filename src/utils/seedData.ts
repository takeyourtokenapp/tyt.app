import { supabase } from '../lib/supabase';

export async function seedDemoData(userId: string) {
  try {
    console.log('Seeding demo data for user:', userId);

    const walletAssets = ['BTC', 'ETH', 'SOL', 'TRX', 'XRP', 'TYT', 'USDT'];

    for (const asset of walletAssets) {
      const balances: Record<string, string> = {
        BTC: '0.05234567',
        ETH: '2.456789',
        SOL: '125.50',
        TRX: '5000.00',
        XRP: '1250.00',
        TYT: '50000.00',
        USDT: '10000.00'
      };

      await supabase.from('custodial_wallets').upsert({
        user_id: userId,
        asset: asset,
        balance: balances[asset] || '0',
        locked_balance: '0'
      }, { onConflict: 'user_id,asset' });
    }

    const { data: existingMiners } = await supabase
      .from('nft_miners')
      .select('id')
      .eq('owner_id', userId)
      .limit(1);

    if (!existingMiners || existingMiners.length === 0) {
      const minerData = [
        {
          owner_id: userId,
          hashrate_th: 110,
          efficiency_w_per_th: 23,
          status: 'active',
          reinvest_percentage: 25,
          last_maintenance_paid: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          owner_id: userId,
          hashrate_th: 95,
          efficiency_w_per_th: 26,
          status: 'active',
          reinvest_percentage: 50,
          last_maintenance_paid: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
          owner_id: userId,
          hashrate_th: 140,
          efficiency_w_per_th: 20,
          status: 'maintenance_due',
          reinvest_percentage: 0,
          last_maintenance_paid: new Date(Date.now() - 86400000 * 32).toISOString()
        }
      ];

      const { data: miners, error: minersError } = await supabase
        .from('nft_miners')
        .insert(minerData)
        .select();

      if (minersError) {
        console.error('Error creating miners:', minersError);
        throw minersError;
      }

      if (miners) {
        for (const miner of miners) {
          for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const grossBtc = (miner.hashrate_th / 1000000) * (Math.random() * 0.5 + 0.8);
            const maintenanceBtc = grossBtc * 0.15;
            const netBtc = grossBtc - maintenanceBtc;

            await supabase.from('daily_rewards').insert({
              miner_id: miner.id,
              reward_date: date.toISOString().split('T')[0],
              hashrate_snapshot_th: miner.hashrate_th,
              gross_btc: grossBtc.toFixed(8),
              maintenance_cost_btc: maintenanceBtc.toFixed(8),
              net_btc: netBtc.toFixed(8),
              reinvest_btc: (netBtc * miner.reinvest_percentage / 100).toFixed(8),
              claimable_btc: (netBtc * (100 - miner.reinvest_percentage) / 100).toFixed(8),
              merkle_leaf: `0x${Math.random().toString(16).substring(2, 66)}`
            });
          }
        }
      }
    }

    const { data: existingCampaigns } = await supabase
      .from('foundation_campaigns')
      .select('id')
      .limit(1);

    if (!existingCampaigns || existingCampaigns.length === 0) {
      await supabase.from('foundation_campaigns').insert([
        {
          title: 'Pediatric Brain Tumor Research Grant',
          description: 'Funding cutting-edge research into new treatment methods for pediatric brain tumors. This grant will support a team of researchers at leading medical institutions.',
          campaign_type: 'research',
          goal_usd: '250000.00',
          raised_usd: '187500.00',
          status: 'active',
          featured_image_url: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          title: 'Family Support Fund',
          description: 'Direct financial assistance to families dealing with the costs of pediatric brain tumor treatment. Covers travel, accommodation, and daily living expenses.',
          campaign_type: 'family_support',
          goal_usd: '100000.00',
          raised_usd: '67890.00',
          status: 'active',
          featured_image_url: 'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          title: 'Advanced MRI Equipment',
          description: 'Purchase of specialized MRI equipment for early detection and monitoring of pediatric brain tumors at partner hospitals.',
          campaign_type: 'equipment',
          goal_usd: '500000.00',
          raised_usd: '342100.00',
          status: 'active',
          featured_image_url: 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ]);
    }

    const { data: existingTracks } = await supabase
      .from('academy_tracks')
      .select('id')
      .limit(1);

    if (!existingTracks || existingTracks.length === 0) {
      await supabase.from('academy_tracks').insert([
        {
          title: 'Bitcoin Mining Basics',
          description: 'Learn the fundamentals of Bitcoin mining, proof-of-work, and how mining pools operate.',
          difficulty_level: 1,
          estimated_hours: 4,
          display_order: 1,
          is_published: true
        },
        {
          title: 'Blockchain Technology',
          description: 'Deep dive into blockchain architecture, consensus mechanisms, and distributed ledger technology.',
          difficulty_level: 1,
          estimated_hours: 6,
          display_order: 2,
          is_published: true
        },
        {
          title: 'Cryptocurrency Trading',
          description: 'Master technical analysis, trading strategies, and risk management in crypto markets.',
          difficulty_level: 2,
          estimated_hours: 8,
          display_order: 3,
          is_published: true
        },
        {
          title: 'DeFi & Smart Contracts',
          description: 'Explore decentralized finance protocols, liquidity pools, and smart contract development.',
          difficulty_level: 2,
          estimated_hours: 10,
          display_order: 4,
          is_published: true
        },
        {
          title: 'NFT Technology',
          description: 'Understanding non-fungible tokens, minting, marketplaces, and real-world applications.',
          difficulty_level: 2,
          estimated_hours: 5,
          display_order: 5,
          is_published: true
        },
        {
          title: 'Advanced Mining Operations',
          description: 'Hardware optimization, energy management, and scaling mining operations professionally.',
          difficulty_level: 3,
          estimated_hours: 12,
          display_order: 6,
          is_published: true
        }
      ]);
    }

    console.log('Demo data seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return { success: false, error };
  }
}

export async function clearDemoData(userId: string) {
  try {
    const { data: miners } = await supabase
      .from('nft_miners')
      .select('id')
      .eq('owner_id', userId);

    if (miners) {
      for (const miner of miners) {
        await supabase
          .from('daily_rewards')
          .delete()
          .eq('miner_id', miner.id);
      }
    }

    await supabase.from('nft_miners').delete().eq('owner_id', userId);
    await supabase.from('custodial_wallets').delete().eq('user_id', userId);

    console.log('Demo data cleared successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error clearing demo data:', error);
    return { success: false, error };
  }
}
