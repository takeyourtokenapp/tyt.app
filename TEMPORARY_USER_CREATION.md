# Temporary User Creation Guide

## Problem
Signup через UI не работает из-за настроек Supabase Auth.

## Temporary Solution
Создайте тестового пользователя напрямую через SQL.

## Step 1: Open Supabase Dashboard SQL Editor

```
https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/sql/new
```

## Step 2: Create Test User

Запустите этот SQL код:

```sql
SELECT public.create_test_user(
  'test@example.com',    -- Your email
  'TestPassword123!',    -- Your password
  'testuser'            -- Optional: username (can be NULL)
);
```

### Example: Create User with Auto-Generated Username
```sql
SELECT public.create_test_user(
  'alex@example.com',
  'MySecurePassword123!'
);
```

## Step 3: Login

После создания пользователя:
1. Откройте `/login`
2. Введите email и password
3. Нажмите "Sign In"
4. Вы должны успешно войти в систему

## Check Created Users

Посмотреть всех созданных пользователей:

```sql
SELECT * FROM public.list_recent_users();
```

## Example Results

```json
{
  "success": true,
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "test@example.com",
  "username": "testuser",
  "message": "User created successfully. You can now login with email and password."
}
```

## Multiple Test Users

```sql
-- Create multiple users for testing
SELECT public.create_test_user('alice@test.com', 'Password123!', 'alice');
SELECT public.create_test_user('bob@test.com', 'Password123!', 'bob');
SELECT public.create_test_user('charlie@test.com', 'Password123!', 'charlie');
```

## Verify User Creation

```sql
-- Check all users
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  p.username,
  p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

## IMPORTANT

**This is a TEMPORARY solution for testing only.**

For production, you MUST:
1. Disable email confirmation in Supabase Dashboard
2. OR configure SMTP for email sending

## Permanent Fix

### Option 1: Disable Email Confirmation (Recommended for Development)

1. Go to: https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/auth/providers
2. Click **Email**
3. Toggle OFF **"Confirm email"**
4. Click **Save**

### Option 2: Configure SMTP (Recommended for Production)

1. Go to: https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/auth/templates
2. Configure SMTP settings
3. Test email sending

---

## Troubleshooting

### Error: "User with this email already exists"
```sql
-- Delete existing user
DELETE FROM auth.users WHERE email = 'test@example.com';
```

### Check signup logs
```sql
SELECT * FROM public.signup_logs
ORDER BY created_at DESC
LIMIT 20;
```

### Diagnose system
```sql
SELECT * FROM public.diagnose_signup_issue();
```
