import { supabase } from '../lib/supabase';

export type EmailTemplate =
  | 'welcome'
  | 'depositConfirmed'
  | 'withdrawalConfirmed'
  | 'withdrawalPending'
  | 'withdrawalApproved'
  | 'withdrawalRejected'
  | 'dailyRewards'
  | 'maintenanceInvoice'
  | 'kycStatusUpdate'
  | 'securityAlert'
  | 'foundationReceipt';

interface SendEmailParams {
  to: string;
  template: EmailTemplate;
  data: Record<string, any>;
}

export async function sendEmail({ to, template, data }: SendEmailParams): Promise<boolean> {
  try {
    const { data: result, error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        template,
        data,
      },
    });

    if (error) {
      console.error('Email service error:', error);
      return false;
    }

    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export const emailNotifications = {
  async welcome(email: string, userName: string) {
    return sendEmail({
      to: email,
      template: 'welcome',
      data: { name: userName },
    });
  },

  async depositConfirmed(email: string, data: {
    amount: string;
    asset: string;
    network?: string;
    fee?: string;
    feePercent?: string;
    newBalance: string;
    txHash?: string;
    explorerUrl?: string;
  }) {
    return sendEmail({
      to: email,
      template: 'depositConfirmed',
      data,
    });
  },

  async withdrawalConfirmed(email: string, data: {
    amount: string;
    asset: string;
    fee: string;
    destination: string;
    txHash: string;
    remainingBalance: string;
    explorerUrl?: string;
  }) {
    return sendEmail({
      to: email,
      template: 'withdrawalConfirmed',
      data,
    });
  },

  async withdrawalPending(email: string, data: {
    userName?: string;
    amount: string;
    asset: string;
    destination: string;
    reason?: string;
  }) {
    return sendEmail({
      to: email,
      template: 'withdrawalPending',
      data,
    });
  },

  async withdrawalApproved(email: string, data: {
    amount: string;
    asset: string;
  }) {
    return sendEmail({
      to: email,
      template: 'withdrawalApproved',
      data,
    });
  },

  async withdrawalRejected(email: string, data: {
    userName?: string;
    amount: string;
    asset: string;
    reason?: string;
  }) {
    return sendEmail({
      to: email,
      template: 'withdrawalRejected',
      data,
    });
  },

  async dailyRewards(email: string, data: {
    btcAmount: string;
    usdValue?: string;
    minersCount?: number;
    totalHashrate?: number;
    discount?: number;
    monthlyTotal?: string;
    monthlyDays?: number;
  }) {
    return sendEmail({
      to: email,
      template: 'dailyRewards',
      data,
    });
  },

  async maintenanceInvoice(email: string, data: {
    invoiceId?: string;
    period?: string;
    minersCount?: number;
    baseCost?: string;
    discount?: number;
    amount: string;
    status: 'paid' | 'pending';
  }) {
    return sendEmail({
      to: email,
      template: 'maintenanceInvoice',
      data,
    });
  },

  async kycStatusUpdate(email: string, data: {
    status: 'approved' | 'rejected' | 'pending';
    tier?: number;
    dailyLimit?: string;
    weeklyLimit?: string;
    monthlyLimit?: string;
    reason?: string;
  }) {
    return sendEmail({
      to: email,
      template: 'kycStatusUpdate',
      data,
    });
  },

  async securityAlert(email: string, data: {
    event?: string;
    description?: string;
    timestamp?: string;
    location?: string;
    device?: string;
  }) {
    return sendEmail({
      to: email,
      template: 'securityAlert',
      data,
    });
  },

  async foundationReceipt(email: string, data: {
    donorName?: string;
    amount: string;
    asset?: string;
    txId?: string;
    totalRaised?: string;
    familiesHelped?: number;
    grantsIssued?: number;
    taxId?: string;
  }) {
    return sendEmail({
      to: email,
      template: 'foundationReceipt',
      data,
    });
  },
};
