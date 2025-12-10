#!/bin/bash

echo "==================================="
echo "TYT Ecosystem - Secrets Generator"
echo "==================================="
echo ""

echo "Generating secure secrets..."
echo ""

WEBHOOK_SECRET=$(openssl rand -base64 32)
WALLET_ENCRYPTION_KEY=$(openssl rand -hex 16)
CRON_SECRET=$(openssl rand -base64 32)

echo "✅ Secrets generated successfully!"
echo ""
echo "Add these to your .env file:"
echo ""
echo "# Security Secrets"
echo "WEBHOOK_SECRET=$WEBHOOK_SECRET"
echo "WALLET_ENCRYPTION_KEY=$WALLET_ENCRYPTION_KEY"
echo "CRON_SECRET=$CRON_SECRET"
echo ""
echo "# TRON Network (get from https://www.trongrid.io/)"
echo "TRONGRID_API_KEY=your_trongrid_api_key_here"
echo ""
echo "# TYT Token (get from pump.fun)"
echo "VITE_TYT_TOKEN_MINT=your_tyt_token_address_here"
echo "VITE_SOLANA_NETWORK=mainnet-beta"
echo ""
echo "==================================="
echo ""
echo "📝 Next steps:"
echo "1. Copy the secrets above to your .env file"
echo "2. Get TRONGRID_API_KEY from https://www.trongrid.io/"
echo "3. Get your TYT token address from pump.fun"
echo "4. Install Solana package: npm install @solana/web3.js@1.87.6"
echo "5. Build the project: npm run build"
echo ""
