import { supabase } from '../../lib/supabase';

export interface LightningNode {
  id: string;
  pubkey: string;
  alias: string;
  nodeType: 'custodial' | 'lnd' | 'cln' | 'eclair' | 'ldk';
  isActive: boolean;
  isOnline: boolean;
  totalCapacitySats: number;
  localBalanceSats: number;
  remoteBalanceSats: number;
  activeChannels: number;
}

export interface LightningInvoice {
  id: string;
  paymentHash: string;
  paymentRequest: string; // BOLT11 invoice
  invoiceType: 'deposit' | 'withdrawal' | 'payment' | 'refund';
  amountSats?: number;
  amountReceivedSats: number;
  description?: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled' | 'failed';
  expiresAt: string;
  paidAt?: string;
  feeSats: number;
  routingFeeSats: number;
  preimage?: string;
}

export interface CreateInvoiceParams {
  userId: string;
  amountSats: number;
  description?: string;
  expirySeconds?: number; // Default: 3600 (1 hour)
  invoiceType?: 'deposit' | 'withdrawal' | 'payment' | 'refund';
}

export interface PayInvoiceParams {
  userId: string;
  paymentRequest: string;
  maxFeeSats?: number;
  timeoutSeconds?: number;
}

export interface PayInvoiceResult {
  success: boolean;
  preimage?: string;
  feeSats?: number;
  error?: string;
}

class LightningService {
  async getUserNode(userId: string): Promise<LightningNode | null> {
    try {
      const { data, error } = await supabase
        .from('lightning_nodes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        pubkey: data.pubkey,
        alias: data.alias || '',
        nodeType: data.node_type,
        isActive: data.is_active,
        isOnline: data.is_online,
        totalCapacitySats: data.total_capacity_sats || 0,
        localBalanceSats: data.local_balance_sats || 0,
        remoteBalanceSats: data.remote_balance_sats || 0,
        activeChannels: data.active_channels || 0,
      };
    } catch (error) {
      console.error('Get user node error:', error);
      return null;
    }
  }

  async createInvoice(params: CreateInvoiceParams): Promise<LightningInvoice> {
    try {
      const { data, error } = await supabase.functions.invoke('create-lightning-invoice', {
        body: {
          userId: params.userId,
          amountSats: params.amountSats,
          description: params.description || '',
          expirySeconds: params.expirySeconds || 3600,
          invoiceType: params.invoiceType || 'deposit',
        },
      });

      if (error) throw error;

      return {
        id: data.id,
        paymentHash: data.payment_hash,
        paymentRequest: data.payment_request,
        invoiceType: data.invoice_type,
        amountSats: data.amount_sats,
        amountReceivedSats: 0,
        description: data.description,
        status: 'pending',
        expiresAt: data.expires_at,
        feeSats: 0,
        routingFeeSats: 0,
      };
    } catch (error: any) {
      console.error('Create Lightning invoice error:', error);
      throw new Error(error.message || 'Failed to create Lightning invoice');
    }
  }

  async payInvoice(params: PayInvoiceParams): Promise<PayInvoiceResult> {
    try {
      const { data, error } = await supabase.functions.invoke('pay-lightning-invoice', {
        body: {
          userId: params.userId,
          paymentRequest: params.paymentRequest,
          maxFeeSats: params.maxFeeSats || 1000,
          timeoutSeconds: params.timeoutSeconds || 60,
        },
      });

      if (error) throw error;

      return {
        success: true,
        preimage: data.preimage,
        feeSats: data.fee_sats,
      };
    } catch (error: any) {
      console.error('Pay Lightning invoice error:', error);
      return {
        success: false,
        error: error.message || 'Failed to pay invoice',
      };
    }
  }

  async getInvoice(paymentHash: string): Promise<LightningInvoice | null> {
    try {
      const { data, error } = await supabase
        .from('lightning_invoices')
        .select('*')
        .eq('payment_hash', paymentHash)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        paymentHash: data.payment_hash,
        paymentRequest: data.payment_request,
        invoiceType: data.invoice_type,
        amountSats: data.amount_sats,
        amountReceivedSats: data.amount_received_sats || 0,
        description: data.description,
        status: data.status,
        expiresAt: data.expires_at,
        paidAt: data.paid_at,
        feeSats: data.fee_sats || 0,
        routingFeeSats: data.routing_fee_sats || 0,
        preimage: data.preimage,
      };
    } catch (error) {
      console.error('Get invoice error:', error);
      return null;
    }
  }

  async getUserInvoices(
    userId: string,
    limit: number = 50
  ): Promise<LightningInvoice[]> {
    try {
      const { data, error } = await supabase
        .from('lightning_invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((inv) => ({
        id: inv.id,
        paymentHash: inv.payment_hash,
        paymentRequest: inv.payment_request,
        invoiceType: inv.invoice_type,
        amountSats: inv.amount_sats,
        amountReceivedSats: inv.amount_received_sats || 0,
        description: inv.description,
        status: inv.status,
        expiresAt: inv.expires_at,
        paidAt: inv.paid_at,
        feeSats: inv.fee_sats || 0,
        routingFeeSats: inv.routing_fee_sats || 0,
        preimage: inv.preimage,
      }));
    } catch (error) {
      console.error('Get user invoices error:', error);
      return [];
    }
  }

  async decodeInvoice(paymentRequest: string): Promise<{
    paymentHash: string;
    amountSats?: number;
    description?: string;
    expiresAt: Date;
    destination: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('decode-lightning-invoice', {
        body: { paymentRequest },
      });

      if (error) throw error;

      return {
        paymentHash: data.payment_hash,
        amountSats: data.amount_sats,
        description: data.description,
        expiresAt: new Date(data.expires_at),
        destination: data.destination,
      };
    } catch (error: any) {
      console.error('Decode invoice error:', error);
      throw new Error(error.message || 'Failed to decode invoice');
    }
  }

  async checkInvoiceStatus(paymentHash: string): Promise<{
    status: 'pending' | 'paid' | 'expired' | 'cancelled' | 'failed';
    amountReceivedSats?: number;
    paidAt?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('lightning_invoices')
        .select('status, amount_received_sats, paid_at')
        .eq('payment_hash', paymentHash)
        .single();

      if (error) throw error;

      return {
        status: data.status,
        amountReceivedSats: data.amount_received_sats,
        paidAt: data.paid_at,
      };
    } catch (error) {
      console.error('Check invoice status error:', error);
      throw error;
    }
  }

  async estimateRoutingFee(amountSats: number): Promise<number> {
    const baseFee = 1;
    const feeRate = 0.001;
    return Math.ceil(baseFee + (amountSats * feeRate));
  }

  formatPaymentRequest(pr: string): string {
    if (pr.length <= 30) return pr;
    return `${pr.slice(0, 15)}...${pr.slice(-15)}`;
  }

  isInvoiceExpired(expiresAt: string): boolean {
    return new Date(expiresAt) < new Date();
  }

  async syncNodeStatus(userId: string): Promise<void> {
    try {
      await supabase.functions.invoke('sync-lightning-node', {
        body: { userId },
      });
    } catch (error) {
      console.error('Sync node status error:', error);
    }
  }
}

export const lightningService = new LightningService();
