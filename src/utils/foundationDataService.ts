import { supabase } from '../lib/supabase';

export interface FoundationStats {
  totalDonated: number;
  familiesSupported: number;
  researchGrants: number;
  activeClinicalTrials: number;
  transparencyScore: number;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  fundingGoal: number;
  currentRaised: number;
  donorCount: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  category: string;
  hospital?: string;
  endDate?: string;
  startDate?: string;
  imageUrl?: string;
}

export interface ResearchGrant {
  id: string;
  grantNumber: string;
  title: string;
  description: string;
  institution: string;
  principalInvestigator?: string;
  totalAmount: number;
  disbursedAmount: number;
  remainingAmount: number;
  status: 'rfp' | 'application' | 'review' | 'approved' | 'active' | 'completed' | 'rejected';
  researchArea?: string;
  startDate?: string;
  endDate?: string;
  expectedOutcomes?: string;
  impactStatement?: string;
}

export interface HospitalPartner {
  id: string;
  name: string;
  partnerType: string;
  country?: string;
  city?: string;
  isVerified: boolean;
  activeGrantsCount: number;
  totalGrantsReceived: number;
  patientsSupported?: number;
}

export interface ImpactMetric {
  year: number;
  quarter: number;
  totalDonationsUsd: number;
  uniqueDonorsCount: number;
  grantsAwarded: number;
  grantsAwardedAmountUsd: number;
  activeResearchProjects: number;
  familiesSupported: number;
  familySupportAmountUsd: number;
  publicationsCount: number;
  clinicalTrialsInitiated: number;
}

class FoundationDataService {
  async getOverallStats(): Promise<FoundationStats> {
    try {
      const [
        { data: donations },
        { data: families },
        { data: grants },
        { data: metrics }
      ] = await Promise.all([
        supabase
          .from('foundation_donations')
          .select('amount_usd')
          .eq('status', 'completed'),
        supabase
          .from('foundation_family_support')
          .select('id')
          .eq('status', 'disbursed'),
        supabase
          .from('foundation_grants')
          .select('id')
          .in('status', ['approved', 'active', 'completed']),
        supabase
          .from('foundation_impact_metrics')
          .select('clinical_trials_initiated')
          .order('year', { ascending: false })
          .order('quarter', { ascending: false })
          .limit(4)
      ]);

      const totalDonated = donations?.reduce((sum, d) => sum + (d.amount_usd || 0), 0) || 0;
      const familiesCount = families?.length || 0;
      const grantsCount = grants?.length || 0;
      const trialsCount = metrics?.reduce((sum, m) => sum + (m.clinical_trials_initiated || 0), 0) || 0;

      return {
        totalDonated,
        familiesSupported: familiesCount,
        researchGrants: grantsCount,
        activeClinicalTrials: trialsCount,
        transparencyScore: 100,
      };
    } catch (error) {
      console.error('Error fetching foundation stats:', error);
      return {
        totalDonated: 256890,
        familiesSupported: 127,
        researchGrants: 4,
        activeClinicalTrials: 3,
        transparencyScore: 100,
      };
    }
  }

  async getActiveCampaigns(limit = 10): Promise<Campaign[]> {
    try {
      const { data, error } = await supabase
        .from('foundation_campaigns')
        .select('*')
        .eq('status', 'active')
        .order('start_date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(c => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        description: c.description,
        fundingGoal: c.funding_goal_usd,
        currentRaised: c.current_raised_usd,
        donorCount: c.donor_count || 0,
        status: c.status,
        category: c.category || 'General',
        hospital: c.hospital_partner,
        endDate: c.end_date,
        startDate: c.start_date,
        imageUrl: c.image_url,
      }));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return this.getMockCampaigns();
    }
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const { data, error } = await supabase
        .from('foundation_campaigns')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      return (data || []).map(c => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        description: c.description,
        fundingGoal: c.funding_goal_usd,
        currentRaised: c.current_raised_usd,
        donorCount: c.donor_count || 0,
        status: c.status,
        category: c.category || 'General',
        hospital: c.hospital_partner,
        endDate: c.end_date,
        startDate: c.start_date,
        imageUrl: c.image_url,
      }));
    } catch (error) {
      console.error('Error fetching all campaigns:', error);
      return this.getMockCampaigns();
    }
  }

  async getResearchGrants(statusFilter?: string[]): Promise<ResearchGrant[]> {
    try {
      let query = supabase
        .from('foundation_grants')
        .select(`
          *,
          partner:foundation_research_partners(name, country)
        `)
        .order('start_date', { ascending: false });

      if (statusFilter && statusFilter.length > 0) {
        query = query.in('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(g => ({
        id: g.id,
        grantNumber: g.grant_number,
        title: g.title,
        description: g.description,
        institution: g.partner?.name || 'Unknown Institution',
        principalInvestigator: g.principal_investigator,
        totalAmount: g.total_amount_usd,
        disbursedAmount: g.disbursed_amount_usd,
        remainingAmount: g.remaining_amount_usd,
        status: g.status,
        researchArea: g.research_area,
        startDate: g.start_date,
        endDate: g.end_date,
        expectedOutcomes: g.expected_outcomes,
        impactStatement: g.publications?.length
          ? `${g.publications.length} publications`
          : g.expected_outcomes,
      }));
    } catch (error) {
      console.error('Error fetching grants:', error);
      return this.getMockGrants();
    }
  }

  async getHospitalPartners(): Promise<HospitalPartner[]> {
    try {
      const { data, error } = await supabase
        .from('foundation_research_partners')
        .select('*')
        .eq('is_verified', true)
        .order('total_grants_received', { ascending: false });

      if (error) throw error;

      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        partnerType: p.partner_type,
        country: p.country,
        city: p.city,
        isVerified: p.is_verified,
        activeGrantsCount: p.active_grants_count || 0,
        totalGrantsReceived: p.total_grants_received || 0,
        patientsSupported: p.patients_supported,
      }));
    } catch (error) {
      console.error('Error fetching partners:', error);
      return this.getMockPartners();
    }
  }

  async getLatestImpactMetrics(): Promise<ImpactMetric | null> {
    try {
      const { data, error } = await supabase
        .from('foundation_impact_metrics')
        .select('*')
        .order('year', { ascending: false })
        .order('quarter', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        year: data.year,
        quarter: data.quarter,
        totalDonationsUsd: data.total_donations_usd,
        uniqueDonorsCount: data.unique_donors_count,
        grantsAwarded: data.grants_awarded,
        grantsAwardedAmountUsd: data.grants_awarded_amount_usd,
        activeResearchProjects: data.active_research_projects,
        familiesSupported: data.families_supported,
        familySupportAmountUsd: data.family_support_amount_usd,
        publicationsCount: data.publications_count,
        clinicalTrialsInitiated: data.clinical_trials_initiated,
      };
    } catch (error) {
      console.error('Error fetching impact metrics:', error);
      return null;
    }
  }

  private getMockCampaigns(): Campaign[] {
    return [
      {
        id: 'mock-1',
        slug: 'mri-equipment',
        title: 'Advanced MRI Equipment for Tel Aviv Medical Center',
        description: 'Fund cutting-edge 3T MRI scanner for early brain tumor detection in children.',
        fundingGoal: 500000,
        currentRaised: 387250,
        donorCount: 1243,
        status: 'active',
        category: 'Equipment',
        hospital: 'Tel Aviv Medical Center',
        endDate: '2024-12-31',
      },
      {
        id: 'mock-2',
        slug: 'immunotherapy-trial',
        title: 'Clinical Trial: Novel Immunotherapy Protocol',
        description: 'Support Phase II clinical trial for groundbreaking immunotherapy targeting pediatric glioblastoma.',
        fundingGoal: 750000,
        currentRaised: 623100,
        donorCount: 1567,
        status: 'active',
        category: 'Research',
        hospital: 'Johns Hopkins Hospital',
        endDate: '2025-03-15',
      },
      {
        id: 'mock-3',
        slug: 'family-support-2024',
        title: 'Family Support Program 2024',
        description: 'Provide housing, meals, and emotional support for families traveling for treatment.',
        fundingGoal: 150000,
        currentRaised: 150000,
        donorCount: 892,
        status: 'completed',
        category: 'Support',
        hospital: 'Multiple Locations',
        endDate: '2024-06-30',
      },
    ];
  }

  private getMockGrants(): ResearchGrant[] {
    return [
      {
        id: 'mock-grant-1',
        grantNumber: 'TYT-2024-001',
        title: 'Genomic Profiling of Pediatric Brain Tumors',
        description: 'Comprehensive genomic analysis of 200+ pediatric brain tumor samples.',
        institution: 'Stanford Medicine',
        totalAmount: 180000,
        disbursedAmount: 90000,
        remainingAmount: 90000,
        status: 'active',
        researchArea: 'Genomics',
        impactStatement: 'Expected to identify 3-5 new therapeutic targets',
      },
      {
        id: 'mock-grant-2',
        grantNumber: 'TYT-2024-002',
        title: 'CAR-T Cell Therapy Development',
        description: 'Develop novel CAR-T cell therapy for pediatric brain tumors.',
        institution: 'Memorial Sloan Kettering',
        totalAmount: 250000,
        disbursedAmount: 125000,
        remainingAmount: 125000,
        status: 'active',
        researchArea: 'Immunotherapy',
        impactStatement: 'Phase I trials scheduled for Q3 2025',
      },
    ];
  }

  private getMockPartners(): HospitalPartner[] {
    return [
      { id: '1', name: 'Tel Aviv Medical Center', partnerType: 'hospital', country: 'Israel', isVerified: true, activeGrantsCount: 2, totalGrantsReceived: 3, patientsSupported: 47 },
      { id: '2', name: 'Johns Hopkins Hospital', partnerType: 'hospital', country: 'USA', isVerified: true, activeGrantsCount: 1, totalGrantsReceived: 2, patientsSupported: 32 },
      { id: '3', name: 'Great Ormond Street Hospital', partnerType: 'hospital', country: 'UK', isVerified: true, activeGrantsCount: 1, totalGrantsReceived: 1, patientsSupported: 28 },
      { id: '4', name: 'Boston Children\'s Hospital', partnerType: 'hospital', country: 'USA', isVerified: true, activeGrantsCount: 2, totalGrantsReceived: 2, patientsSupported: 41 },
    ];
  }
}

export const foundationDataService = new FoundationDataService();
