#!/bin/bash

# TYT v2 Project Recreation Script
# This script recreates all project files on your Mac

set -e

echo "🚀 TYT v2 Project Recreation Script"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    echo "Please run this from ~/Desktop/tyt.app"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""
echo "⚠️  WARNING: This will overwrite existing files!"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "Creating project structure..."

# Create directories
mkdir -p src/{components,contexts,hooks,lib,pages/app,types,utils/api,config}
mkdir -p public
mkdir -p supabase/{migrations,functions/{blockchain-webhook,check-balance,generate-custodial-address,generate-deposit-address,get-swap-rate,monitor-deposits,process-deposit,process-payment,process-withdrawal,sync-real-balances}}
mkdir -p .bolt

echo "✅ Directory structure created"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Download all files from the Bolt.new interface"
echo "   OR"
echo "2. Manually copy the following key files:"
echo ""
echo "   Core files:"
echo "   - package.json"
echo "   - tsconfig.json"
echo "   - vite.config.ts"
echo "   - tailwind.config.js"
echo "   - .env (with your Supabase keys)"
echo ""
echo "   Source files (src/):"
echo "   - All .tsx and .ts files from src/"
echo ""
echo "   Supabase:"
echo "   - All migration files"
echo "   - All edge function files"
echo ""
echo "3. Run: npm install"
echo "4. Run: npm run build"
echo "5. Run: git add . && git commit -m 'feat: Complete TYT v2' && git push"
echo ""
echo "✨ Done!"
