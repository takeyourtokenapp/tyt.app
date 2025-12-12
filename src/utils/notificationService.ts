import { supabase } from '../lib/supabase';

export type NotificationType =
  | 'system'
  | 'transaction'
  | 'mining'
  | 'maintenance'
  | 'marketplace'
  | 'security'
  | 'kyc'
  | 'foundation'
  | 'referral'
  | 'promotion';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  metadata?: Record<string, any>;
  read: boolean;
  read_at?: string;
  created_at: string;
  expires_at?: string;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  types: {
    system: boolean;
    transaction: boolean;
    mining: boolean;
    maintenance: boolean;
    marketplace: boolean;
    security: boolean;
    kyc: boolean;
    foundation: boolean;
    referral: boolean;
    promotion: boolean;
  };
}

export class NotificationService {
  /**
   * Get user notifications
   */
  static async getUserNotifications(
    userId: string,
    options?: {
      unreadOnly?: boolean;
      type?: NotificationType;
      limit?: number;
    }
  ): Promise<{ data: Notification[] | null; error: any }> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (options?.unreadOnly) {
        query = query.eq('read', false);
      }

      if (options?.type) {
        query = query.eq('type', options.type);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      // Filter out expired notifications
      query = query.or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`);

      const { data, error } = await query;

      return { data, error };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: null, error };
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)
        .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return (data as any)?.count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Create a notification
   */
  static async createNotification(
    notification: Omit<Notification, 'id' | 'created_at' | 'read' | 'read_at'>
  ): Promise<{ data: Notification | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          read: false
        })
        .select()
        .single();

      // If email is enabled, send email notification
      if (data) {
        await this.sendEmailNotification(notification.user_id, data);
      }

      return { data, error };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { data: null, error };
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      return { error };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { error };
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('read', false);

      return { error };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { error };
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      return { error };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { error };
    }
  }

  /**
   * Delete all read notifications
   */
  static async deleteAllRead(userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .eq('read', true);

      return { error };
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      return { error };
    }
  }

  /**
   * Get notification preferences
   */
  static async getPreferences(
    userId: string
  ): Promise<{ data: NotificationPreferences | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!data) {
        // Return default preferences
        return {
          data: {
            email_enabled: true,
            push_enabled: true,
            in_app_enabled: true,
            types: {
              system: true,
              transaction: true,
              mining: true,
              maintenance: true,
              marketplace: true,
              security: true,
              kyc: true,
              foundation: true,
              referral: true,
              promotion: false
            }
          },
          error: null
        };
      }

      return { data, error };
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return { data: null, error };
    }
  }

  /**
   * Update notification preferences
   */
  static async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<{ data: NotificationPreferences | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return { data: null, error };
    }
  }

  /**
   * Send email notification (if enabled)
   */
  private static async sendEmailNotification(userId: string, notification: Notification) {
    try {
      // Check if email notifications are enabled
      const { data: preferences } = await this.getPreferences(userId);

      if (!preferences?.email_enabled) {
        return;
      }

      // Check if this type of notification is enabled
      if (!preferences.types[notification.type as keyof typeof preferences.types]) {
        return;
      }

      // Get user email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .maybeSingle();

      if (!profile?.email) {
        return;
      }

      // Call email edge function
      await supabase.functions.invoke('send-email', {
        body: {
          to: profile.email,
          subject: notification.title,
          template: 'notification',
          data: {
            title: notification.title,
            message: notification.message,
            actionUrl: notification.action_url,
            actionLabel: notification.action_label
          }
        }
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
      // Don't throw - email is optional
    }
  }

  /**
   * Subscribe to real-time notifications
   */
  static subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ): () => void {
    const subscription = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  }

  /**
   * Helper: Create transaction notification
   */
  static async notifyTransaction(
    userId: string,
    type: 'deposit' | 'withdrawal' | 'reward',
    amount: number,
    currency: string,
    txHash?: string
  ) {
    const titles = {
      deposit: 'Deposit Received',
      withdrawal: 'Withdrawal Processed',
      reward: 'Mining Reward'
    };

    const messages = {
      deposit: `Your deposit of ${amount} ${currency} has been confirmed.`,
      withdrawal: `Your withdrawal of ${amount} ${currency} has been processed.`,
      reward: `You earned ${amount} ${currency} in mining rewards!`
    };

    return this.createNotification({
      user_id: userId,
      type: 'transaction',
      priority: 'normal',
      title: titles[type],
      message: messages[type],
      action_url: txHash ? `/app/wallet?tx=${txHash}` : '/app/wallet',
      action_label: 'View Transaction',
      metadata: { amount, currency, txHash }
    });
  }

  /**
   * Helper: Create maintenance notification
   */
  static async notifyMaintenance(
    userId: string,
    dueAmount: number,
    dueDate: Date,
    urgent: boolean = false
  ) {
    return this.createNotification({
      user_id: userId,
      type: 'maintenance',
      priority: urgent ? 'high' : 'normal',
      title: urgent ? 'Urgent: Maintenance Payment Due' : 'Maintenance Payment Due',
      message: `Your maintenance payment of $${dueAmount.toFixed(2)} is due on ${dueDate.toLocaleDateString()}.`,
      action_url: '/app/wallet',
      action_label: 'Pay Now',
      metadata: { amount: dueAmount, dueDate: dueDate.toISOString() }
    });
  }

  /**
   * Helper: Create KYC notification
   */
  static async notifyKYC(
    userId: string,
    status: 'approved' | 'rejected' | 'review',
    tier: number,
    reason?: string
  ) {
    const titles = {
      approved: 'KYC Verification Approved',
      rejected: 'KYC Verification Rejected',
      review: 'KYC Under Review'
    };

    const messages = {
      approved: `Congratulations! Your KYC verification (Tier ${tier}) has been approved.`,
      rejected: `Your KYC verification was rejected. ${reason || 'Please resubmit your documents.'}`,
      review: `Your KYC documents are under review. We'll notify you once complete.`
    };

    return this.createNotification({
      user_id: userId,
      type: 'kyc',
      priority: status === 'approved' ? 'normal' : 'high',
      title: titles[status],
      message: messages[status],
      action_url: '/app/settings',
      action_label: status === 'rejected' ? 'Resubmit' : 'View Details',
      metadata: { status, tier, reason }
    });
  }

  /**
   * Helper: Create security notification
   */
  static async notifySecurityAlert(
    userId: string,
    alertType: string,
    message: string
  ) {
    return this.createNotification({
      user_id: userId,
      type: 'security',
      priority: 'urgent',
      title: 'Security Alert',
      message,
      action_url: '/app/settings',
      action_label: 'Review Security',
      metadata: { alertType }
    });
  }
}

export default NotificationService;
