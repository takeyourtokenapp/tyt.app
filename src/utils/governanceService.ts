/**
 * Governance Service
 *
 * Manages governance proposals, voting, and veTYT power.
 * Integrates with on-chain VotingEscrowTYT contract.
 */

import { supabase } from '../lib/supabase';

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  param_key: string;
  current_value: string | null;
  proposed_value: string;
  proposer_id: string;
  proposed_by?: string;
  status: 'active' | 'passed' | 'rejected' | 'executed' | 'cancelled';
  voting_starts_at: string;
  voting_ends_at: string;
  start_time?: string;
  end_time?: string;
  quorum_required: number;
  execution_data: Record<string, any>;
  executed_at: string | null;
  execution_tx: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface GovernanceVote {
  id: string;
  proposal_id: string;
  user_id: string;
  wallet_address: string;
  voting_power: number;
  choice: 'yes' | 'no' | 'abstain';
  reason: string | null;
  created_at: string;
}

export interface VeTYTCache {
  user_id: string;
  wallet_address: string;
  voting_power: number;
  locked_amount: number;
  lock_end: string | null;
  last_updated: string;
}

export interface VoteTally {
  yes: number;
  no: number;
  abstain: number;
  total: number;
  quorum: number;
  passed: boolean;
  yes_pct: number;
  no_pct: number;
  turnout_pct?: number;
}

export interface ProposalStatus {
  proposal_id: string;
  title: string;
  status: string;
  voting_starts_at?: string;
  voting_ends_at: string;
  votes: VoteTally;
  vote_count: number;
  can_execute?: boolean;
  executed_at: string | null;
  execution_tx: string | null;
}

export class GovernanceService {
  /**
   * Get all governance proposals
   */
  async getProposals(options: {
    status?: string[];
    limit?: number;
    offset?: number;
  } = {}): Promise<GovernanceProposal[]> {
    const { status, limit = 50, offset = 0 } = options;

    let query = supabase
      .from('governance_proposals')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status.length > 0) {
      query = query.in('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get active proposals
   */
  async getActiveProposals(): Promise<GovernanceProposal[]> {
    return this.getProposals({ status: ['active', 'passed'] });
  }

  /**
   * Get proposal by ID
   */
  async getProposal(proposalId: string): Promise<GovernanceProposal | null> {
    const { data, error } = await supabase
      .from('governance_proposals')
      .select('*')
      .eq('id', proposalId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Create a new proposal
   */
  async createProposal(params: {
    title: string;
    description: string;
    paramKey: string;
    proposedValue: string;
    votingDurationDays?: number;
  }): Promise<string> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error('Not authenticated');
    }

    const userId = session.session.user.id;

    const { data, error } = await supabase.rpc('create_proposal', {
      p_user_id: userId,
      p_title: params.title,
      p_description: params.description,
      p_param_key: params.paramKey,
      p_proposed_value: params.proposedValue,
      p_voting_duration_days: params.votingDurationDays || 7,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Cast a vote on a proposal
   */
  async castVote(params: {
    proposalId: string;
    choice: 'yes' | 'no' | 'abstain';
    reason?: string;
  }): Promise<void> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error('Not authenticated');
    }

    const userId = session.session.user.id;

    const { error } = await supabase.rpc('cast_vote_v2', {
      p_user_id: userId,
      p_proposal_id: params.proposalId,
      p_choice: params.choice,
      p_reason: params.reason || null,
    });

    if (error) throw error;
  }

  /**
   * Get vote tally for a proposal
   */
  async getTally(proposalId: string): Promise<VoteTally> {
    const { data, error } = await supabase.rpc('tally_proposal_v2', {
      p_proposal_id: proposalId,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Get detailed proposal status
   */
  async getProposalStatus(proposalId: string): Promise<ProposalStatus | null> {
    const { data, error } = await supabase.rpc('get_proposal_status_v2', {
      p_proposal_id: proposalId,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Get votes for a proposal
   */
  async getVotes(proposalId: string): Promise<GovernanceVote[]> {
    const { data, error } = await supabase
      .from('governance_votes')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user's vote on a proposal
   */
  async getUserVote(
    proposalId: string,
    userId?: string
  ): Promise<GovernanceVote | null> {
    let targetUserId = userId;

    if (!targetUserId) {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        return null;
      }
      targetUserId = session.session.user.id;
    }

    const { data, error } = await supabase
      .from('governance_votes')
      .select('*')
      .eq('proposal_id', proposalId)
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get user's voting power
   */
  async getVotingPower(userId?: string): Promise<number> {
    let targetUserId = userId;

    if (!targetUserId) {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        return 0;
      }
      targetUserId = session.session.user.id;
    }

    const { data, error } = await supabase.rpc('get_user_voting_power', {
      p_user_id: targetUserId,
    });

    if (error) throw error;
    return data || 0;
  }

  /**
   * Get user's veTYT cache
   */
  async getVeTYTCache(userId?: string): Promise<VeTYTCache | null> {
    let targetUserId = userId;

    if (!targetUserId) {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        return null;
      }
      targetUserId = session.session.user.id;
    }

    const { data, error } = await supabase
      .from('user_vetyt_cache')
      .select('*')
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Update user's veTYT power from on-chain
   */
  async updateVeTYTPower(userId?: string, walletAddress?: string): Promise<VeTYTCache> {
    let targetUserId = userId;

    if (!targetUserId) {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error('Not authenticated');
      }
      targetUserId = session.session.user.id;
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-vetyt-power`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          user_id: targetUserId,
          wallet_address: walletAddress,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update veTYT power');
    }

    return await response.json();
  }

  /**
   * Get proposals created by user
   */
  async getUserProposals(userId?: string): Promise<GovernanceProposal[]> {
    let targetUserId = userId;

    if (!targetUserId) {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        return [];
      }
      targetUserId = session.session.user.id;
    }

    const { data, error } = await supabase
      .from('governance_proposals')
      .select('*')
      .or(`proposer_id.eq.${targetUserId},proposed_by.eq.${targetUserId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user's voting history
   */
  async getUserVotes(userId?: string, limit = 50): Promise<GovernanceVote[]> {
    let targetUserId = userId;

    if (!targetUserId) {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        return [];
      }
      targetUserId = session.session.user.id;
    }

    const { data, error } = await supabase
      .from('governance_votes')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Check if user can create proposals
   */
  async canCreateProposal(userId?: string): Promise<{
    canCreate: boolean;
    votingPower: number;
    required: number;
  }> {
    const votingPower = await this.getVotingPower(userId);
    const required = 1000;

    return {
      canCreate: votingPower >= required,
      votingPower,
      required,
    };
  }

  /**
   * Get governance statistics
   */
  async getStatistics(): Promise<{
    total_proposals: number;
    active_proposals: number;
    executed_proposals: number;
    total_voters: number;
    total_voting_power: number;
  }> {
    const { data: proposalStats, error: propError } = await supabase
      .from('governance_proposals')
      .select('status', { count: 'exact', head: true });

    const { count: totalProposals } = proposalStats || { count: 0 };

    const { data: activeStats } = await supabase
      .from('governance_proposals')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');

    const { data: executedStats } = await supabase
      .from('governance_proposals')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'executed');

    const { data: voterStats } = await supabase
      .from('user_vetyt_cache')
      .select('user_id, voting_power')
      .gt('voting_power', 0);

    return {
      total_proposals: totalProposals || 0,
      active_proposals: activeStats?.count || 0,
      executed_proposals: executedStats?.count || 0,
      total_voters: voterStats?.length || 0,
      total_voting_power: voterStats?.reduce((sum, v) => sum + Number(v.voting_power), 0) || 0,
    };
  }

  /**
   * Subscribe to proposal updates (real-time)
   */
  subscribeToProposals(callback: (proposal: GovernanceProposal) => void) {
    const channel = supabase
      .channel('governance-proposals')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'governance_proposals',
        },
        (payload) => {
          callback(payload.new as GovernanceProposal);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Subscribe to votes on a proposal
   */
  subscribeToVotes(proposalId: string, callback: (vote: GovernanceVote) => void) {
    const channel = supabase
      .channel(`votes-${proposalId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'governance_votes',
          filter: `proposal_id=eq.${proposalId}`,
        },
        (payload) => {
          callback(payload.new as GovernanceVote);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const governanceService = new GovernanceService();
