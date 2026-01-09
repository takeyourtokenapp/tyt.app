# 📧 TYT Platform - Contact System Complete Guide

**Complete implementation guide for user-to-admin contact system**

**Created**: January 2, 2026
**Status**: Ready for implementation

---

## 🎯 System Overview

### What This System Does

Allows users on **takeyourtoken.app** to:
- Send messages to administration
- Report issues or bugs
- Ask questions
- Request support
- Submit feedback

**Response channels**:
- 📧 Email: support@takeyourtoken.com
- 💬 Telegram: Chat ID -5175884242

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   User Submits Form                     │
│              (takeyourtoken.app/contact)                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│           Supabase: contact_submissions table           │
│  Stores: name, email, subject, message, timestamp       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│         Database Trigger: on_contact_submission         │
│      Fires immediately after new row inserted           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│      Edge Function: contact-notification               │
│  1. Fetch contact details from foundation table        │
│  2. Send email via Resend API                          │
│  3. Send Telegram message via Bot API                  │
│  4. Update submission status                            │
└──────────────────────┬──────────────────────────────────┘
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
┌─────────────────────┐  ┌─────────────────────┐
│   Email (Resend)    │  │   Telegram Bot      │
│ support@tyt.com     │  │   Chat -5175884242  │
└─────────────────────┘  └─────────────────────┘
```

---

## ✅ What's Already Done

Based on your information:

### 1. Database Table: `contact_submissions`
**Status**: ✅ Created

```sql
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  notified_at timestamptz,
  error_message text
);
```

### 2. Edge Function: `contact-notification`
**Status**: ✅ Deployed

Location: `supabase/functions/contact-notification/`

### 3. Foundation Contact Info
**Status**: ✅ Configured

```sql
-- In foundation table
email: support@takeyourtoken.com
telegram_chat_id: -5175884242
```

---

## ⚠️ What Needs to Be Done

### 1. Database Trigger
**Status**: 🔴 Not Created

### 2. Frontend Contact Form
**Status**: 🔴 Not Created

### 3. Admin Panel for Messages
**Status**: 🔴 Not Created

### 4. Environment Variables
**Status**: 🔴 Need Configuration

---

## 🔧 Implementation Steps

### Step 1: Database Setup (10 minutes)

#### 1.1 Create Contact Submissions Table (if not exists)

**Migration file**: `supabase/migrations/YYYYMMDD_create_contact_system.sql`

```sql
/*
  # Contact System Setup

  1. Tables
    - contact_submissions: Stores all contact form submissions

  2. RLS Policies
    - Anonymous users can insert
    - Admins can view all

  3. Trigger
    - Auto-notify on new submission
*/

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'failed', 'resolved')),
  created_at timestamptz DEFAULT now(),
  notified_at timestamptz,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  error_message text,

  -- Indexes
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Add indexes for performance
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit (including anonymous)
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only admins can view submissions
CREATE POLICY "Admins can view all submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Policy: Only admins can update status
CREATE POLICY "Admins can update submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Add foundation contact info (if not exists)
CREATE TABLE IF NOT EXISTS foundation_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_type text NOT NULL, -- 'primary', 'support', 'emergency'
  email text NOT NULL,
  telegram_chat_id text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Insert default contact
INSERT INTO foundation_contacts (contact_type, email, telegram_chat_id)
VALUES ('primary', 'support@takeyourtoken.com', '-5175884242')
ON CONFLICT DO NOTHING;
```

#### 1.2 Create Database Trigger

**Important**: This trigger automatically calls the Edge Function

```sql
-- Create trigger function
CREATE OR REPLACE FUNCTION notify_contact_submission()
RETURNS TRIGGER AS $$
DECLARE
  response_status int;
BEGIN
  -- Call Edge Function asynchronously
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/contact-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.supabase_anon_key')
    ),
    body := jsonb_build_object(
      'submission_id', NEW.id,
      'name', NEW.name,
      'email', NEW.email,
      'subject', NEW.subject,
      'message', NEW.message
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the insert
  RAISE WARNING 'Failed to call contact-notification function: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_contact_submission ON contact_submissions;
CREATE TRIGGER on_contact_submission
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_submission();
```

**Note**: If `net.http_post` is not available (requires `pg_net` extension), use an alternative approach:

```sql
-- Alternative: Use Supabase Webhooks (Recommended)
-- Configure in Supabase Dashboard:
-- Database → Webhooks → Create new webhook
-- Table: contact_submissions
-- Events: INSERT
-- Type: HTTP Request
-- URL: https://your-project.supabase.co/functions/v1/contact-notification
-- HTTP Headers:
--   Authorization: Bearer YOUR_ANON_KEY
--   Content-Type: application/json
```

#### 1.3 Apply Migration

```bash
# Apply migration
supabase db push

# Or via SQL Editor in Supabase Dashboard
# Copy and paste the SQL above
```

---

### Step 2: Edge Function Setup (15 minutes)

#### 2.1 Create Edge Function

**File**: `supabase/functions/contact-notification/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactSubmission {
  submission_id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { submission_id, name, email, subject, message }: ContactSubmission = await req.json();

    // 1. Get foundation contact info
    const { data: contacts } = await supabase
      .from('foundation_contacts')
      .select('email, telegram_chat_id')
      .eq('contact_type', 'primary')
      .eq('is_active', true)
      .single();

    if (!contacts) {
      throw new Error('No active foundation contacts found');
    }

    // 2. Send Email via Resend
    const emailSent = await sendEmailNotification({
      to: contacts.email,
      name,
      email,
      subject,
      message,
    });

    // 3. Send Telegram notification
    const telegramSent = await sendTelegramNotification({
      chatId: contacts.telegram_chat_id,
      name,
      email,
      subject,
      message,
    });

    // 4. Update submission status
    if (emailSent || telegramSent) {
      await supabase
        .from('contact_submissions')
        .update({
          status: 'notified',
          notified_at: new Date().toISOString(),
        })
        .eq('id', submission_id);
    } else {
      throw new Error('Failed to send notifications');
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailSent,
        telegramSent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in contact-notification:', error);

    // Try to update submission with error
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      await supabase
        .from('contact_submissions')
        .update({
          status: 'failed',
          error_message: error.message,
        })
        .eq('id', req.json().submission_id);
    } catch (updateError) {
      console.error('Failed to update submission status:', updateError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Email via Resend
async function sendEmailNotification(params: {
  to: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return false;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'TYT Platform <noreply@takeyourtoken.com>',
        to: params.to,
        subject: `[Contact Form] ${params.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${params.name} (${params.email})</p>
          <p><strong>Subject:</strong> ${params.subject}</p>
          <hr />
          <h3>Message:</h3>
          <p>${params.message.replace(/\n/g, '<br>')}</p>
          <hr />
          <p><small>Sent from takeyourtoken.app</small></p>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return false;
    }

    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Telegram via Bot API
async function sendTelegramNotification(params: {
  chatId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!TELEGRAM_BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN not configured');
      return false;
    }

    const text = `
🔔 *New Contact Form Submission*

👤 *From:* ${params.name}
📧 *Email:* ${params.email}
📝 *Subject:* ${params.subject}

💬 *Message:*
${params.message}

---
Sent from takeyourtoken.app
    `.trim();

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: params.chatId,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
      return false;
    }

    console.log('Telegram message sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}
```

#### 2.2 Deploy Edge Function

```bash
# Deploy function
supabase functions deploy contact-notification

# Set environment secrets
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
supabase secrets set TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

**Get API Keys**:

**Resend** (Email):
1. Sign up at https://resend.com
2. Create API key
3. Verify your domain (or use test mode)

**Telegram Bot**:
1. Open Telegram and message @BotFather
2. Send `/newbot` and follow instructions
3. Copy the bot token
4. Add bot to your group/channel
5. Get chat ID (use @userinfobot or this API):
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```

---

### Step 3: Frontend Contact Form (20 minutes)

#### 3.1 Create Contact Page

**File**: `src/pages/Contact.tsx`

```typescript
import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Validate
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        throw new Error('Please fill in all fields');
      }

      // Submit to database (trigger will handle notification)
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-amber-500 to-gold-500 rounded-full">
              <Mail className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg">
            Have a question? Need support? We're here to help!
          </p>
        </div>

        {/* Success Message */}
        {status === 'success' && (
          <div className="mb-8 p-6 bg-green-500/10 border border-green-500/50 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-400 mb-1">Message Sent!</h3>
              <p className="text-sm text-gray-300">
                Thank you for contacting us. We'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-400 mb-1">Error</h3>
              <p className="text-sm text-gray-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            {/* Name */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="John Doe"
                required
                disabled={status === 'submitting'}
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="john@example.com"
                required
                disabled={status === 'submitting'}
              />
            </div>

            {/* Subject */}
            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject *
              </label>
              <select
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                required
                disabled={status === 'submitting'}
              >
                <option value="">Select a subject...</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Partnership">Partnership Opportunity</option>
                <option value="Press/Media">Press/Media Inquiry</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message *
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-gold-500 transition-colors resize-none"
                placeholder="Please describe your inquiry in detail..."
                required
                disabled={status === 'submitting'}
              />
              <p className="text-xs text-gray-500 mt-2">
                {formData.message.length} / 1000 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-400 hover:to-gold-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>

        {/* Alternative Contact Methods */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <Mail className="w-8 h-8 text-gold-400 mb-3" />
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-gray-400 text-sm mb-2">
              For direct inquiries
            </p>
            <a
              href="mailto:support@takeyourtoken.com"
              className="text-gold-400 hover:text-gold-300 text-sm"
            >
              support@takeyourtoken.com
            </a>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <MessageSquare className="w-8 h-8 text-gold-400 mb-3" />
            <h3 className="font-semibold mb-2">Telegram</h3>
            <p className="text-gray-400 text-sm mb-2">
              Join our community
            </p>
            <a
              href="https://t.me/takeyourtoken"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 text-sm"
            >
              @takeyourtoken
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 3.2 Add Route

**File**: `src/App.tsx`

```typescript
// Add to lazy imports
const Contact = lazyWithRetry(() => import('./pages/Contact'), 'Contact');

// Add to public routes
<Route path="/contact" element={
  <PublicLayout>
    <Suspense fallback={<PageLoader />}>
      <Contact />
    </Suspense>
  </PublicLayout>
} />
```

#### 3.3 Add to Navigation

**File**: `src/components/PublicLayout.tsx` (or Header.tsx)

```typescript
<Link
  to="/contact"
  className="text-gray-300 hover:text-gold-400 transition-colors"
>
  Contact
</Link>
```

---

### Step 4: Admin Panel (30 minutes)

#### 4.1 Create Admin Page for Messages

**File**: `src/pages/app/AdminMessages.tsx`

```typescript
import { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'notified' | 'failed' | 'resolved';
  created_at: string;
  notified_at: string | null;
  resolved_at: string | null;
  error_message: string | null;
}

export default function AdminMessages() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'notified' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    loadSubmissions();

    // Real-time updates
    const subscription = supabase
      .channel('contact_submissions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, () => {
        loadSubmissions();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkResolved = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id,
        })
        .eq('id', id);

      if (error) throw error;
      loadSubmissions();
    } catch (error) {
      console.error('Error marking as resolved:', error);
    }
  };

  const filteredSubmissions = submissions
    .filter((s) => filter === 'all' || s.status === filter)
    .filter((s) =>
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { icon: Clock, color: 'text-yellow-400 bg-yellow-400/20', label: 'Pending' },
      notified: { icon: CheckCircle, color: 'text-green-400 bg-green-400/20', label: 'Notified' },
      failed: { icon: XCircle, color: 'text-red-400 bg-red-400/20', label: 'Failed' },
      resolved: { icon: CheckCircle, color: 'text-blue-400 bg-blue-400/20', label: 'Resolved' },
    };

    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${badge.color}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contact Messages</h1>
          <p className="text-gray-400">Manage user inquiries and support requests</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSubmissions}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold">{submissions.length}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4">
          <p className="text-yellow-400 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold">{submissions.filter((s) => s.status === 'pending').length}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4">
          <p className="text-green-400 text-sm mb-1">Notified</p>
          <p className="text-2xl font-bold">{submissions.filter((s) => s.status === 'notified').length}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4">
          <p className="text-blue-400 text-sm mb-1">Resolved</p>
          <p className="text-2xl font-bold">{submissions.filter((s) => s.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gold-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gold-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="notified">Notified</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-12 text-center border border-gray-700">
            <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No messages found</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => setSelectedSubmission(submission)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{submission.name}</h3>
                    {getStatusBadge(submission.status)}
                  </div>
                  <p className="text-gray-400 text-sm">{submission.email}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {new Date(submission.created_at).toLocaleString()}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gold-400 font-medium mb-2">{submission.subject}</p>
                <p className="text-gray-300 line-clamp-2">{submission.message}</p>
              </div>

              {submission.status === 'failed' && submission.error_message && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-300">
                    <strong>Notification failed:</strong> {submission.error_message}
                  </div>
                </div>
              )}

              {submission.status !== 'resolved' && (
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkResolved(submission.id);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm transition-colors"
                  >
                    Mark as Resolved
                  </button>
                  <a
                    href={`mailto:${submission.email}?subject=Re: ${submission.subject}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                  >
                    Reply via Email
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedSubmission.subject}</h2>
                <div className="flex items-center gap-3">
                  <p className="text-gray-400">{selectedSubmission.name}</p>
                  <span className="text-gray-600">•</span>
                  <p className="text-gray-400">{selectedSubmission.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              {getStatusBadge(selectedSubmission.status)}
              <p className="text-sm text-gray-500 mt-2">
                Submitted: {new Date(selectedSubmission.created_at).toLocaleString()}
              </p>
              {selectedSubmission.notified_at && (
                <p className="text-sm text-gray-500">
                  Notified: {new Date(selectedSubmission.notified_at).toLocaleString()}
                </p>
              )}
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Message:</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{selectedSubmission.message}</p>
            </div>

            <div className="flex gap-2">
              {selectedSubmission.status !== 'resolved' && (
                <button
                  onClick={() => {
                    handleMarkResolved(selectedSubmission.id);
                    setSelectedSubmission(null);
                  }}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
              <a
                href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}
                className="flex-1 py-3 bg-gold-600 hover:bg-gold-500 rounded-lg font-semibold text-center transition-colors"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### 4.2 Add to App Routes

**File**: `src/App.tsx`

```typescript
// Add to lazy imports
const AdminMessages = lazyWithRetry(() => import('./pages/app/AdminMessages'), 'AdminMessages');

// Add to protected admin routes
<Route path="/app/admin-messages" element={
  <ProtectedRoute>
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <AdminMessages />
      </Suspense>
    </AppLayout>
  </ProtectedRoute>
} />
```

#### 4.3 Add to Admin Menu

**File**: `src/components/AppLayout.tsx` (or wherever admin menu is)

```typescript
<Link
  to="/app/admin-messages"
  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700"
>
  <Mail size={20} />
  Messages
</Link>
```

---

## 🧪 Testing the System

### Test 1: Submit Contact Form

```bash
# 1. Open app
http://localhost:5173/contact

# 2. Fill form:
Name: Test User
Email: test@example.com
Subject: Test Message
Message: This is a test message

# 3. Click "Send Message"

# Expected:
✅ Form submits successfully
✅ Success message shows
✅ Form clears
```

### Test 2: Check Database

```sql
-- Check submission was inserted
SELECT * FROM contact_submissions
ORDER BY created_at DESC
LIMIT 1;

-- Expected:
-- status: 'notified' (if trigger worked)
-- notified_at: timestamp (if notifications sent)
```

### Test 3: Check Email

```
Check support@takeyourtoken.com inbox
Expected: Email with subject "[Contact Form] Test Message"
```

### Test 4: Check Telegram

```
Check Telegram chat -5175884242
Expected: Message with contact form details
```

### Test 5: Admin Panel

```bash
# 1. Login as admin
http://localhost:5173/app/admin-messages

# 2. Should see:
✅ List of all submissions
✅ Correct status badges
✅ Search functionality
✅ Filter by status
✅ Mark as resolved button
```

---

## 🔧 Troubleshooting

### Issue: Trigger not firing

**Solution**:
```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_contact_submission';

-- Re-create trigger
DROP TRIGGER IF EXISTS on_contact_submission ON contact_submissions;
CREATE TRIGGER on_contact_submission
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_submission();
```

### Issue: Email not sending

**Check**:
1. RESEND_API_KEY is set in Edge Function secrets
2. Email domain is verified in Resend dashboard
3. Check Edge Function logs in Supabase Dashboard

**Test manually**:
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_RESEND_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "noreply@takeyourtoken.com",
    "to": "support@takeyourtoken.com",
    "subject": "Test",
    "html": "<p>Test</p>"
  }'
```

### Issue: Telegram not sending

**Check**:
1. TELEGRAM_BOT_TOKEN is set
2. Bot is added to chat/group
3. Chat ID is correct (including minus sign for groups)

**Test manually**:
```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "-5175884242",
    "text": "Test message"
  }'
```

### Issue: RLS blocking inserts

**Solution**:
```sql
-- Verify RLS policy allows anonymous inserts
SELECT * FROM pg_policies
WHERE tablename = 'contact_submissions'
AND policyname LIKE '%insert%';

-- Should see:
-- Policy: "Anyone can submit contact form"
-- Roles: {anon, authenticated}
```

---

## 📊 Monitoring & Maintenance

### Daily Tasks

```sql
-- Check pending submissions
SELECT COUNT(*) FROM contact_submissions
WHERE status = 'pending';

-- Check failed notifications
SELECT * FROM contact_submissions
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### Weekly Tasks

```sql
-- Review resolved messages
SELECT COUNT(*),
       DATE_TRUNC('week', created_at) as week
FROM contact_submissions
WHERE status = 'resolved'
GROUP BY week
ORDER BY week DESC;

-- Average response time
SELECT AVG(
  EXTRACT(EPOCH FROM (resolved_at - created_at))
) / 3600 as avg_hours_to_resolve
FROM contact_submissions
WHERE status = 'resolved'
AND resolved_at > NOW() - INTERVAL '7 days';
```

### Performance Optimization

```sql
-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status_created
  ON contact_submissions(status, created_at DESC);

-- Analyze table
ANALYZE contact_submissions;
```

---

## 🎯 Future Enhancements

### Phase 2 Features

1. **Auto-responder**
   - Send automatic "We received your message" email

2. **Categorization**
   - AI-powered subject classification
   - Auto-assign to team members

3. **Internal notes**
   - Admins can add private notes to submissions

4. **Response templates**
   - Pre-written responses for common questions

5. **Priority levels**
   - Urgent, high, medium, low

6. **SLA tracking**
   - Track response time goals

7. **Multi-language support**
   - Detect message language
   - Route to appropriate support agent

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] Database migration applied
- [ ] Trigger created and tested
- [ ] Edge Function deployed
- [ ] Environment secrets set (RESEND_API_KEY, TELEGRAM_BOT_TOKEN)
- [ ] Foundation contacts configured
- [ ] Contact form page created
- [ ] Admin panel created
- [ ] Routes added to App.tsx

### Testing

- [ ] Submit test form
- [ ] Verify email received
- [ ] Verify Telegram message received
- [ ] Check database entry
- [ ] Test admin panel
- [ ] Test search and filters
- [ ] Test mark as resolved
- [ ] Test RLS (non-admin can't see messages)

### Production

- [ ] Verify domain in Resend
- [ ] Update "from" email in Edge Function
- [ ] Configure rate limiting (optional)
- [ ] Set up monitoring alerts
- [ ] Document support process for team
- [ ] Train support team on admin panel

---

## 📞 Support

### Common Questions

**Q: Can users submit without logging in?**
A: Yes, the form is available to anonymous users (anon role).

**Q: How do I add more notification channels?**
A: Extend the Edge Function to call additional APIs (Discord, Slack, etc).

**Q: Can I customize the email template?**
A: Yes, edit the HTML in `sendEmailNotification()` function.

**Q: How do I prevent spam?**
A: Add rate limiting or CAPTCHA (see Phase 2 enhancements).

**Q: Can I reply directly from admin panel?**
A: Currently opens mail client. Phase 2 can add in-app replies.

---

## 📚 Related Documentation

- **Edge Functions**: `supabase/functions/README.md`
- **Database Schema**: `supabase/migrations/`
- **Admin Guide**: `docs/ADMIN_GUIDE.md`
- **Deployment**: `APP_DEPLOYMENT_QUICK_START.md`

---

**Last Updated**: January 2, 2026
**Version**: 1.0
**Status**: ✅ Ready for Implementation

**Estimated Setup Time**: 1-2 hours
**Difficulty**: Intermediate

**Let's connect with users! 📧**
