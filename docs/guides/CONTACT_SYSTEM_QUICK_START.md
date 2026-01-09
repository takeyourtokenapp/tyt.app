# 📧 Contact System - Quick Start

**Get contact system running in 1 hour**

---

## 🎯 What You'll Build

User contact form → Database → Email + Telegram → Admin panel

**Time**: 1 hour
**Result**: Full contact system working

---

## ⚡ Quick Steps

### Step 1: Database (5 minutes)

```sql
-- Run in Supabase SQL Editor
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  notified_at timestamptz
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view all" ON contact_submissions FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND is_admin = true));
```

### Step 2: Edge Function (10 minutes)

```bash
# Get API keys
# Resend: https://resend.com
# Telegram: @BotFather

# Set secrets
supabase secrets set RESEND_API_KEY=re_xxx
supabase secrets set TELEGRAM_BOT_TOKEN=123:ABC

# Deploy (code in CONTACT_SYSTEM_GUIDE.md)
supabase functions deploy contact-notification
```

### Step 3: Contact Form (20 minutes)

```bash
# Copy code from CONTACT_SYSTEM_GUIDE.md → Step 3.1
# Create file: src/pages/Contact.tsx

# Add to App.tsx:
# 1. Import: const Contact = lazyWithRetry(...)
# 2. Route: <Route path="/contact" element={<Contact />} />
# 3. Navigation: Add link in header
```

### Step 4: Admin Panel (20 minutes)

```bash
# Copy code from CONTACT_SYSTEM_GUIDE.md → Step 4.1
# Create file: src/pages/app/AdminMessages.tsx

# Add to App.tsx:
# 1. Import: const AdminMessages = lazyWithRetry(...)
# 2. Route: <Route path="/app/admin-messages" element={<AdminMessages />} />
# 3. Admin menu: Add link in AppLayout
```

### Step 5: Test (5 minutes)

1. Submit form at `/contact`
2. Check email: support@takeyourtoken.com
3. Check Telegram: -5175884242
4. View in admin: `/app/admin-messages`

---

## ✅ Done!

**Full guide**: `CONTACT_SYSTEM_GUIDE.md`

**System now working**:
- Users can contact you
- You get email + Telegram
- You can manage in admin panel
