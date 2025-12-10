# 🚀 DEPLOYMENT GUIDE - HOSTINGER

**Project**: Take Your Token (TYT) v2.0
**Domain**: takeyourtoken.app
**Hosting**: Hostinger.com

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ Before You Start

- [ ] Hostinger account active
- [ ] Domain `takeyourtoken.app` registered
- [ ] Supabase project created
- [ ] Environment variables ready
- [ ] Build tested locally (`npm run build`)

---

## 🔧 STEP 1: CONFIGURE SUPABASE

### 1.1 Get Supabase Credentials

1. Go to https://supabase.com
2. Open your project
3. Go to Settings → API
4. Copy:
   - Project URL
   - Anon (public) key
   - Service role key (keep secret!)

### 1.2 Update .env File

Edit `/tmp/cc-agent/61321319/project/.env`:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**IMPORTANT**: Never commit `.env` to Git!

---

## 🏗️ STEP 2: BUILD THE PROJECT

### 2.1 Install Dependencies

```bash
cd /tmp/cc-agent/61321319/project
npm install
```

### 2.2 Run Production Build

```bash
npm run build
```

Expected output:
```
✓ 1569 modules transformed.
dist/index.html                   2.02 kB
dist/assets/index-BycwYoUZ.css   31.98 kB
dist/assets/index-im8OSJT4.js   425.48 kB
✓ built in 6.95s
```

### 2.3 Verify Build

Check that `/dist` folder contains:
- `index.html`
- `assets/` folder with CSS and JS files
- `.htaccess` file
- Logo image files

---

## 📤 STEP 3: UPLOAD TO HOSTINGER

### Method 1: File Manager (Recommended for Beginners)

1. **Login to Hostinger**
   - Go to https://hpanel.hostinger.com
   - Enter your credentials

2. **Access File Manager**
   - Click on your domain
   - Click "File Manager"
   - Navigate to `public_html` folder

3. **Clear Existing Files**
   - Select all files in `public_html`
   - Delete them (backup first if needed!)

4. **Upload Build Files**
   - Click "Upload"
   - Select ALL files from your `/dist` folder
   - Wait for upload to complete

5. **Verify Structure**
   Your `public_html` should look like:
   ```
   public_html/
   ├── index.html
   ├── .htaccess
   ├── favicon.svg
   ├── 6d629383-acba-4396-8f01-4715f914aada.png
   ├── robots.txt
   └── assets/
       ├── index-BycwYoUZ.css
       └── index-im8OSJT4.js
   ```

### Method 2: FTP (For Advanced Users)

1. **Get FTP Credentials**
   - Hostinger Panel → FTP Accounts
   - Note: hostname, username, password, port

2. **Connect with FTP Client** (FileZilla recommended)
   ```
   Host: ftp.takeyourtoken.app
   Username: your_ftp_username
   Password: your_ftp_password
   Port: 21
   ```

3. **Upload Files**
   - Navigate to `public_html` on remote
   - Navigate to `/dist` on local
   - Select all files → Upload

---

## 🌐 STEP 4: CONFIGURE DOMAIN

### 4.1 Check DNS Settings

In Hostinger Panel:
1. Go to Domains → DNS Zone Editor
2. Verify these records exist:

```
Type    Name    Points to           TTL
A       @       [Your_Server_IP]    14400
A       www     [Your_Server_IP]    14400
```

### 4.2 SSL Certificate

1. Hostinger Panel → SSL
2. Select your domain
3. Click "Install SSL"
4. Choose "Free SSL" (Let's Encrypt)
5. Wait 10-15 minutes for activation

### 4.3 Force HTTPS

The `.htaccess` file already handles this:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# SPA Routing
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## ✅ STEP 5: VERIFY DEPLOYMENT

### 5.1 Test Website

Visit these URLs and verify:

1. **Homepage**: https://takeyourtoken.app
   - Should show landing page
   - Gold owl logo visible
   - All sections load

2. **Login**: https://takeyourtoken.app/login
   - Login form displays
   - Can attempt login (will fail without DB)

3. **App**: https://takeyourtoken.app/app
   - Should redirect to login
   - Auth protection working

### 5.2 Check Performance

Use these tools:

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Test: https://takeyourtoken.app
   - Target: 90+ score

2. **GTmetrix**
   - https://gtmetrix.com/
   - Test loading speed

3. **Mobile Test**
   - Open on phone
   - Check responsive design

### 5.3 Test Forms

1. Try signup (will fail without Supabase configured)
2. Check error messages display correctly
3. Test wallet connect (optional)

---

## 🗄️ STEP 6: CONFIGURE DATABASE (SUPABASE)

### 6.1 Run Migrations

In your local terminal:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

Alternatively, run migrations manually:

1. Go to Supabase Dashboard
2. SQL Editor
3. Copy content from each file in `supabase/migrations/`
4. Execute in order (by filename timestamp)

### 6.2 Verify Tables Created

In Supabase Dashboard → Table Editor, verify:
- users
- miners
- rewards
- maintenance_payments
- marketplace_listings
- academy_progress
- foundation_donations
- governance_proposals

---

## 🔐 STEP 7: SECURITY CHECKLIST

### 7.1 Environment Variables

- [ ] `.env` NOT uploaded to server
- [ ] Anon key is public (safe to expose)
- [ ] Service role key NEVER in frontend

### 7.2 Hostinger Security

1. **Enable Cloudflare** (in Hostinger Panel)
   - DDoS protection
   - CDN caching
   - SSL management

2. **Set File Permissions**
   - Folders: 755
   - Files: 644
   - `.htaccess`: 644

3. **Disable Directory Listing**
   Already in `.htaccess`:
   ```apache
   Options -Indexes
   ```

### 7.3 Backup Plan

1. **Enable Hostinger Backups**
   - Hostinger Panel → Backups
   - Enable daily backups

2. **Local Backup**
   - Keep `/dist` folder locally
   - Version control (Git)

---

## 🐛 TROUBLESHOOTING

### Problem: White Screen / Blank Page

**Solution**:
1. Check browser console (F12)
2. Look for errors
3. Common issue: Wrong Supabase URL/keys
4. Fix: Update `.env` and rebuild

### Problem: 404 on Routes

**Solution**:
1. Verify `.htaccess` uploaded
2. Check Apache mod_rewrite enabled
3. Contact Hostinger support if needed

### Problem: CSS Not Loading

**Solution**:
1. Check `assets/` folder uploaded
2. Clear browser cache (Ctrl+Shift+R)
3. Check file permissions

### Problem: Logo Not Showing

**Solution**:
1. Verify image files in `public_html/`
2. Check file names match exactly
3. Test direct URL: `https://takeyourtoken.app/6d629383-acba-4396-8f01-4715f914aada.png`

### Problem: Slow Loading

**Solution**:
1. Enable Hostinger CDN
2. Enable gzip compression (already in `.htaccess`)
3. Optimize images
4. Use Cloudflare

---

## 📊 MONITORING & ANALYTICS

### Set Up Google Analytics

1. **Create GA4 Property**
   - https://analytics.google.com
   - Create account → Property

2. **Get Measurement ID**
   - Format: `G-XXXXXXXXXX`

3. **Add to index.html** (before </head>):
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

4. **Rebuild and redeploy**

### Monitor Uptime

Use these free services:
- UptimeRobot (https://uptimerobot.com)
- Pingdom (https://www.pingdom.com)

---

## 🚀 POST-DEPLOYMENT

### Launch Checklist

- [ ] Website accessible via HTTPS
- [ ] All pages load correctly
- [ ] Mobile responsive
- [ ] Forms work (with Supabase)
- [ ] Images display
- [ ] Logo shows correctly
- [ ] SSL certificate active
- [ ] Analytics tracking
- [ ] Social media links correct
- [ ] Foundation section visible

### Announce Launch

1. **Social Media**
   - Twitter announcement
   - Telegram channel post
   - LinkedIn update

2. **Community**
   - Update GitHub README
   - Post on relevant subreddits
   - Crypto forums

3. **Press**
   - Draft press release
   - Contact crypto news sites
   - Reach out to influencers

---

## 🔄 FUTURE UPDATES

### How to Deploy Updates

1. **Make changes locally**
2. **Test thoroughly** (`npm run dev`)
3. **Build** (`npm run build`)
4. **Backup current site** (download from Hostinger)
5. **Upload new `/dist` files**
6. **Clear cache** (Cloudflare if enabled)
7. **Test live site**

### Continuous Deployment (Advanced)

Set up GitHub Actions:

1. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to Hostinger
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
         - run: npm install
         - run: npm run build
         - name: FTP Deploy
           uses: SamKirkland/FTP-Deploy-Action@4.3.0
           with:
             server: ftp.takeyourtoken.app
             username: ${{ secrets.FTP_USERNAME }}
             password: ${{ secrets.FTP_PASSWORD }}
             local-dir: ./dist/
   ```

2. Add FTP credentials to GitHub Secrets

---

## 📞 SUPPORT

### Hostinger Support

- **Live Chat**: Available 24/7 in Hostinger Panel
- **Email**: support@hostinger.com
- **Knowledge Base**: https://support.hostinger.com

### Technical Support

- **Email**: support@takeyourtoken.app
- **Telegram**: https://t.me/takeyourtoken
- **GitHub Issues**: For bugs

---

## ✅ DEPLOYMENT COMPLETE!

Your TakeYourToken platform is now live at:

🌐 **https://takeyourtoken.app**

Next steps:
1. Set up authentication flows
2. Add test users
3. Monitor performance
4. Collect feedback
5. Iterate and improve

**Welcome to the Owl Warrior ecosystem!**

---

*Last Updated: December 10, 2024*
*For questions: deployment@takeyourtoken.app*
