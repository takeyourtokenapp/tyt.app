# Admin Panel Guide

## Overview

A comprehensive admin panel has been implemented in the TakeYourToken application for administrators to monitor the platform ecosystem and manage user communications.

## Features Implemented

### 1. Admin Dashboard (`/app/admin/dashboard`)

Central hub for administrators with:

#### Real-time Statistics
- **Total Users**: All registered users count
- **Active Users**: Users active in the last 7 days
- **Unread Messages**: Contact form submissions requiring attention
- **Pending KYC**: KYC verifications awaiting review
- **Total Miners**: NFT miners in the ecosystem
- **Total Hashrate**: Combined mining power (TH/s)
- **Foundation Donations**: Total funds raised for the children's brain cancer foundation
- **Recent Transactions**: Activity in the last 24 hours

#### Quick Actions
Direct links to:
- View Messages
- Manage Users
- Review Withdrawals
- Foundation Stats
- Smart Contracts Monitor

#### System Health Monitor
Real-time status of:
- API Status
- Database Health
- Blockchain Sync
- Background Workers

### 2. Messages Management (`/app/admin/messages`)

Complete contact form management system:

#### Features
- **Statistics Dashboard**: Total, Unread, Read, and Answered message counts
- **Advanced Filtering**: Filter by status (All, Unread, Read, Answered)
- **Search**: Full-text search across name, email, subject, and message content
- **Message Details**: Full message viewer with sender information
- **Status Management**:
  - Mark as Read
  - Mark as Answered
  - Track answered date/time
- **Direct Reply**: Quick email reply links
- **CSV Export**: Export all messages for record-keeping

#### Message Information Displayed
- Sender name and email
- Subject and full message
- Submission date and time
- Read/Answered status
- Visual indicators for new messages

### 3. Admin Access Control

#### Security Implementation
- Automatic admin check on page load
- Profile-based access control using `is_admin` field
- Non-admin users are redirected to dashboard
- Separate hook (`useAdminCheck`) for reusable access verification

#### Navigation
- Admin section automatically appears in sidebar for admin users
- Hidden from regular users
- Distinct visual styling (red theme) for admin section

## Database Schema

### `profiles` Table Enhancement
```sql
ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
CREATE INDEX idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;
```

### `contact_messages` Table
```sql
CREATE TABLE contact_messages (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  is_answered boolean DEFAULT false,
  answered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Row Level Security (RLS)

### Policies Implemented

1. **Admins can view all messages**
   - Only users with `is_admin = true` can view all contact messages

2. **Admins can update messages**
   - Only admins can mark messages as read or answered

3. **Users can view own messages**
   - Authenticated users can view messages they submitted

4. **Anyone can create messages**
   - Both anonymous and authenticated users can submit contact forms

## Contact Form Integration

### Redirect System
All contact links throughout the application redirect to:
```
https://tyt.foundation/#contact
```

This includes:
- Footer contact links
- Help page support buttons
- Email verification support links
- Header contact buttons

### Configuration
```typescript
// src/config/contact.ts
export const CONTACT_CONFIG = {
  FOUNDATION_CONTACT_URL: 'https://tyt.foundation/#contact',
  openContactForm: () => {
    window.open('https://tyt.foundation/#contact', '_blank', 'noopener,noreferrer');
  }
};
```

## How to Create an Admin User

### Method 1: Direct Database Update
```sql
UPDATE profiles
SET is_admin = true
WHERE email = 'admin@example.com';
```

### Method 2: Via Supabase Dashboard
1. Navigate to Table Editor
2. Open `profiles` table
3. Find the user row
4. Edit `is_admin` field to `true`

## Routes Added

```typescript
/app/admin                   → Admin Dashboard
/app/admin/dashboard         → Admin Dashboard (alias)
/app/admin/messages          → Contact Messages Management
/app/admin/users             → User Management (existing)
/app/admin/withdrawals       → Withdrawal Management (existing)
/app/admin/contracts         → Smart Contracts Monitor (existing)
```

## Files Created/Modified

### New Files
- `src/pages/app/AdminDashboard.tsx` - Main admin dashboard (419 lines)
- `src/pages/app/AdminMessages.tsx` - Contact messages manager (419 lines)
- `src/hooks/useAdminCheck.ts` - Reusable admin verification hook
- `src/config/contact.ts` - Contact form configuration

### Modified Files
- `src/App.tsx` - Added admin routes
- `src/components/AppLayout.tsx` - Added admin navigation section
- `src/components/Footer.tsx` - Updated contact links to use redirect
- `src/pages/Help.tsx` - Updated support button redirect
- `src/components/EmailVerification.tsx` - Updated support link

### Database Migrations
- `add_is_admin_to_profiles.sql` - Added is_admin field
- `create_contact_messages_table.sql` - Created contact messages system

## Usage Examples

### Accessing Admin Panel
1. Sign in as an admin user
2. Admin section appears at the top of the sidebar (red theme)
3. Click "Admin Dashboard" to view statistics
4. Navigate to "Messages" to manage contact form submissions

### Managing Messages
1. Navigate to `/app/admin/messages`
2. Use filters to view Unread, Read, or Answered messages
3. Click on a message to view full details
4. Use "Mark as Answered" button after responding
5. Click "Reply via Email" for direct email response
6. Export all messages via "Export CSV" button

### Monitoring Ecosystem
1. Visit Admin Dashboard for overview
2. View real-time statistics
3. Check system health status
4. Use quick action links to navigate to specific areas

## Security Considerations

1. **Access Control**: All admin pages verify `is_admin` status on load
2. **RLS Policies**: Database-level security ensures data isolation
3. **Type Safety**: TypeScript interfaces ensure data integrity
4. **Redirect Protection**: Non-admin users are automatically redirected
5. **Session Validation**: Uses Supabase auth for session management

## Future Enhancements

Potential additions:
- Admin reply system within the dashboard
- Email templates for common responses
- Message categories/tags
- Priority marking
- Automated response suggestions
- Analytics and reporting
- User behavior tracking
- Platform usage statistics
- Revenue analytics

## Technical Stack

- **Frontend**: React + TypeScript
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context + Hooks

## Build Status

✅ All features implemented and tested
✅ Database migrations applied successfully
✅ RLS policies configured and secured
✅ Production build passing
✅ Type safety verified

Build size: 379.63 kB (107.85 kB gzipped)
