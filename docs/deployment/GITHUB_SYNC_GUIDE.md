# GitHub Synchronization Guide

Безопасная синхронизация проекта TYT V3 с GitHub.

---

## ✅ Pre-Sync Checklist

Перед синхронизацией убедитесь:

- [x] **.gitignore** настроен и включает .env файлы
- [x] **.env.example** создан без реальных credentials
- [x] **API_KEYS_SECURITY.md** удален
- [x] Все чувствительные данные удалены из документации
- [x] Проект успешно собирается (`npm run build`)

---

## 🔐 Security First

### Что НЕ должно попасть в GitHub:

❌ `.env` файлы с реальными ключами
❌ API keys и секреты
❌ Database credentials
❌ Private keys
❌ Deployment secrets
❌ Файлы с суффиксом *_PRIVATE, *_SECRET, *CONFIDENTIAL

### Что ДОЛЖНО быть в GitHub:

✅ Исходный код (src/)
✅ Документация (docs/)
✅ Конфигурация проекта
✅ .env.example (без реальных значений)
✅ README.md и SECURITY.md
✅ Smart contracts
✅ Миграции базы данных

---

## 📦 First-Time Setup

### 1. Initialize Git Repository

```bash
cd /path/to/tyt-v3

# Initialize git
git init

# Verify .gitignore
cat .gitignore
```

### 2. Create Initial Commit

```bash
# Add all files
git add .

# Check what will be committed
git status

# Create first commit
git commit -m "Initial commit: TYT V3 Web3 Mining Platform

- Complete React + TypeScript application
- Supabase integration with RLS
- Multi-language support (EN/RU/HE)
- Theme system (Light/Dark)
- Admin panel and contact system
- Comprehensive documentation
- Smart contracts (EVM + Solana)
- Security hardening complete"
```

### 3. Create GitHub Repository

1. Go to https://github.com/new
2. Create new repository:
   - Name: `tyt-v3` (или другое имя)
   - Description: "TYT V3 - Web3 Mining Platform with Charity"
   - Visibility: **Private** (recommended initially)
   - ❌ Don't initialize with README (у нас уже есть)

### 4. Connect and Push

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/tyt-v3.git

# Push to GitHub
git push -u origin main
```

---

## 🔄 Ongoing Synchronization

### Push Changes

```bash
# Check status
git status

# Add changed files
git add .

# Commit with descriptive message
git commit -m "Description of changes"

# Push to GitHub
git push
```

### Pull Changes

```bash
# Pull latest changes
git pull origin main
```

---

## 🛡️ GitHub Repository Settings

### Security Settings

1. **Enable Branch Protection**
   - Settings → Branches → Add rule
   - Branch name: `main`
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass

2. **Enable Dependabot**
   - Settings → Security → Dependabot
   - ✅ Enable Dependabot alerts
   - ✅ Enable Dependabot security updates

3. **Configure Secrets**
   - Settings → Secrets and variables → Actions
   - Add secrets for CI/CD (if needed)

### Access Control

1. **Collaborators**
   - Settings → Collaborators
   - Add team members with appropriate permissions

2. **Deploy Keys** (if deploying from GitHub)
   - Settings → Deploy keys
   - Add read-only keys for deployment

---

## 🚨 Emergency: Accidentally Committed Secrets

Если вы случайно закоммитили секреты:

### Option 1: Remove from Last Commit

```bash
# Remove file
git rm --cached .env

# Amend commit
git commit --amend

# Force push (если еще не запушили)
git push -f
```

### Option 2: Rewrite History (если уже запушили)

```bash
# Use BFG Repo Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove sensitive file from all history
bfg --delete-files .env

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push -f
```

### Option 3: Rotate All Secrets

**ВАЖНО**: После любой утечки:
1. Немедленно смените все скомпрометированные ключи
2. Проверьте логи на несанкционированный доступ
3. Обновите `.env` файлы
4. Уведомите команду

---

## 📋 Git Best Practices

### Commit Messages

**Good**:
```
Add user authentication system

- Implement Supabase auth
- Add login/signup pages
- Configure RLS policies
```

**Bad**:
```
fix stuff
```

### Branching Strategy

```bash
# Create feature branch
git checkout -b feature/new-feature

# Work on feature
git add .
git commit -m "Implement feature"

# Push feature branch
git push origin feature/new-feature

# Create Pull Request on GitHub
# Merge after review
```

### Ignore Patterns

Already configured in `.gitignore`:
- ✅ `.env*` (except .env.example)
- ✅ `node_modules/`
- ✅ `dist/`
- ✅ `*.log`
- ✅ Security-related folders

---

## 🔍 Pre-Push Checklist

Before each push, verify:

```bash
# 1. No sensitive files
git status

# 2. Review changes
git diff

# 3. Check for secrets (optional tool)
# npm install -g detect-secrets
# detect-secrets scan

# 4. Build succeeds
npm run build

# 5. Tests pass (if applicable)
npm test

# 6. Push
git push
```

---

## 🤖 GitHub Actions (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

---

## 📞 Support

Проблемы с синхронизацией?

1. Проверьте `.gitignore`
2. Убедитесь, что remote настроен правильно: `git remote -v`
3. Проверьте права доступа на GitHub
4. Обратитесь к документации Git: https://git-scm.com/doc

---

## ✅ Verification

После первой синхронизации проверьте:

1. Repository появился на GitHub
2. README.md отображается корректно
3. Файлы .env НЕ в репозитории
4. Документация доступна
5. Issues и Pull Requests работают

---

**Last Updated**: January 2026
**Status**: ✅ Ready for GitHub sync
