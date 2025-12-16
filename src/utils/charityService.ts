/**
 * Charity Service
 *
 * Manages TYT Children's Brain Cancer Research & Support Foundation.
 * Handles transaction tracking, grant management, impact reports, and donations.
 */

import { supabase } from '../lib/supabase';

export interface FoundationTransaction {
  id: string;
  source_type: string;
  source_id: string | null;
  user_id: string | null;
  asset: string;
  amount: number;
  usd_value: number | null;
  tx_hash: string | null;
  block_number: number | null;
  destination: 'charity' | 'academy';
  fiscal_year: number;
  fiscal_quarter: number;
  notes: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface FoundationAllocation {
  id: string;
  grant_id: string;
  asset: string;
  amount: number;
  usd_value: number | null;
  allocation_date: string;
  allocation_type: string;
  tx_hash: string | null;
  note: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface FoundationGrant {
  id: string;
  grant_number: string;
  title: string;
  description: string;
  partner_id: string;
  principal_investigator: string;
  total_amount_usd: number;
  disbursed_amount_usd: number;
  remaining_amount_usd: number;
  start_date: string;
  end_date: string;
  status: string;
  research_area: string;
  target_age_group: string;
  tumor_types: string[];
  milestone_count: number;
  completed_milestones: number;
  proposal_url: string | null;
  irb_approval_number: string | null;
  expected_outcomes: string | null;
  publications: string[];
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImpactReport {
  id: string;
  period_start: string;
  period_end: string;
  report_type: string;
  total_in_by_asset: Record<string, string>;
  total_out_by_asset: Record<string, string>;
  total_in_usd: number | null;
  total_out_usd: number | null;
  grants_awarded: number;
  families_helped: number;
  research_projects: number;
  summary_markdown: string | null;
  executive_summary: string | null;
  key_achievements: string[];
  external_links: any[];
  pdf_url: string | null;
  video_url: string | null;
  is_published: boolean;
  published_at: string | null;
  published_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FoundationSummary {
  unique_donors: number;
  total_transactions: number;
  total_usd_value: number;
  charity_total_usd: number;
  academy_total_usd: number;
}

export interface FoundationBalance {
  asset: string;
  total_in: number;
  total_out: number;
  balance: number;
  balance_usd: number;
}

export class CharityService {
  /**
   * Get foundation summary statistics
   */
  async getFoundationSummary(): Promise<FoundationSummary> {
    const { data, error } = await supabase
      .from('foundation_summary')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data || {
      unique_donors: 0,
      total_transactions: 0,
      total_usd_value: 0,
      charity_total_usd: 0,
      academy_total_usd: 0,
    };
  }

  /**
   * Get foundation transactions
   */
  async getTransactions(
    limit: number = 50,
    destination?: 'charity' | 'academy'
  ): Promise<FoundationTransaction[]> {
    let query = supabase
      .from('foundation_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (destination) {
      query = query.eq('destination', destination);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Get user's donation history
   */
  async getUserDonations(userId: string): Promise<FoundationTransaction[]> {
    const { data, error } = await supabase
      .from('foundation_transactions')
      .select('*')
      .eq('user_id', userId)
      .in('source_type', ['USER_DIRECT', 'REWARDS_PERCENT'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get transactions by source type
   */
  async getTransactionsBySource(sourceType: string): Promise<FoundationTransaction[]> {
    const { data, error } = await supabase
      .from('foundation_transactions')
      .select('*')
      .eq('source_type', sourceType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get foundation summary by source
   */
  async getSummaryBySource(): Promise<any[]> {
    const { data, error } = await supabase
      .from('foundation_summary_by_source')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get foundation summary by period
   */
  async getSummaryByPeriod(): Promise<any[]> {
    const { data, error } = await supabase
      .from('foundation_summary_by_period')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get active grants
   */
  async getActiveGrants(): Promise<FoundationGrant[]> {
    const { data, error } = await supabase
      .from('foundation_grants')
      .select('*')
      .eq('status', 'active')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get all grants
   */
  async getAllGrants(): Promise<FoundationGrant[]> {
    const { data, error } = await supabase
      .from('foundation_grants')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get grant by ID
   */
  async getGrantById(grantId: string): Promise<FoundationGrant | null> {
    const { data, error } = await supabase
      .from('foundation_grants')
      .select('*')
      .eq('id', grantId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get grant allocations
   */
  async getGrantAllocations(grantId: string): Promise<FoundationAllocation[]> {
    const { data, error } = await supabase
      .from('foundation_allocations')
      .select('*')
      .eq('grant_id', grantId)
      .order('allocation_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get grant allocation summary
   */
  async getGrantAllocationSummary(): Promise<any[]> {
    const { data, error } = await supabase
      .from('grant_allocation_summary')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get published impact reports
   */
  async getPublishedReports(): Promise<ImpactReport[]> {
    const { data, error } = await supabase
      .from('foundation_impact_reports')
      .select('*')
      .eq('is_published', true)
      .order('period_end', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get latest impact report
   */
  async getLatestReport(): Promise<ImpactReport | null> {
    const { data, error } = await supabase
      .from('foundation_impact_reports')
      .select('*')
      .eq('is_published', true)
      .order('period_end', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get foundation balance by asset
   */
  async getFoundationBalance(asset?: string): Promise<FoundationBalance[]> {
    const { data, error } = await supabase.rpc('get_foundation_balance', {
      p_asset: asset || null,
    });

    if (error) throw error;
    return data || [];
  }

  /**
   * Make direct charity donation
   */
  async makeDonation(
    asset: string,
    amount: number,
    usdValue?: number
  ): Promise<string> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error('Not authenticated');
    }

    const { data: txId, error } = await supabase.rpc('make_charity_donation', {
      p_user_id: session.session.user.id,
      p_asset: asset,
      p_amount: amount,
      p_usd_value: usdValue || null,
    });

    if (error) throw error;
    return txId;
  }

  /**
   * Get user's total donations
   */
  async getUserDonationTotal(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('foundation_transactions')
      .select('usd_value')
      .eq('user_id', userId)
      .in('source_type', ['USER_DIRECT', 'REWARDS_PERCENT']);

    if (error) throw error;

    return (
      data?.reduce((sum, tx) => sum + (tx.usd_value || 0), 0) || 0
    );
  }

  /**
   * Get fiscal year stats
   */
  async getFiscalYearStats(year: number): Promise<any> {
    const { data, error } = await supabase
      .from('foundation_transactions')
      .select('*')
      .eq('fiscal_year', year);

    if (error) throw error;

    const charity = data?.filter((tx) => tx.destination === 'charity') || [];
    const academy = data?.filter((tx) => tx.destination === 'academy') || [];

    return {
      year,
      total_transactions: data?.length || 0,
      charity_transactions: charity.length,
      academy_transactions: academy.length,
      charity_total_usd: charity.reduce((sum, tx) => sum + (tx.usd_value || 0), 0),
      academy_total_usd: academy.reduce((sum, tx) => sum + (tx.usd_value || 0), 0),
      total_usd: data?.reduce((sum, tx) => sum + (tx.usd_value || 0), 0) || 0,
    };
  }

  /**
   * Subscribe to new transactions
   */
  subscribeToTransactions(callback: (transaction: FoundationTransaction) => void) {
    const channel = supabase
      .channel('foundation-transactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'foundation_transactions',
        },
        (payload) => {
          callback(payload.new as FoundationTransaction);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Subscribe to new impact reports
   */
  subscribeToReports(callback: (report: ImpactReport) => void) {
    const channel = supabase
      .channel('impact-reports')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'foundation_impact_reports',
          filter: 'is_published=eq.true',
        },
        (payload) => {
          callback(payload.new as ImpactReport);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Record charity income (admin only - called by backend)
   */
  async recordCharityIncome(
    sourceType: string,
    asset: string,
    amount: number,
    options: {
      sourceId?: string;
      userId?: string;
      usdValue?: number;
      txHash?: string;
    } = {}
  ): Promise<string> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/record-charity-income`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_type: sourceType,
          asset,
          amount,
          ...options,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to record charity income');
    }

    const result = await response.json();
    return result.transaction_id;
  }
}

export const charityService = new CharityService();
