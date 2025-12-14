#!/bin/bash

# ============================================
# TYT V2 DEPLOYMENT SCRIPT
# ============================================
# Quick deployment script for TYT Ecosystem V2
# Run: ./deploy.sh [network]
# Example: ./deploy.sh amoy

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if .env exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_info "Copy .env.example to .env and configure it:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

# Load environment variables
source .env

# Get network argument
NETWORK=${1:-amoy}

print_header "TYT V2 DEPLOYMENT SCRIPT"
print_info "Network: $NETWORK"
print_info "Deployer: $ADMIN_ADDRESS"

# Check prerequisites
print_header "CHECKING PREREQUISITES"

# Check if forge is installed
if ! command -v forge &> /dev/null; then
    print_error "Foundry not found. Install it first:"
    echo "  curl -L https://foundry.paradigm.xyz | bash"
    echo "  foundryup"
    exit 1
fi
print_success "Foundry installed"

# Check if .env has required variables
if [ -z "$PRIVATE_KEY" ]; then
    print_error "PRIVATE_KEY not set in .env"
    exit 1
fi
print_success "Private key configured"

if [ -z "$AMOY_RPC_URL" ]; then
    print_error "AMOY_RPC_URL not set in .env"
    exit 1
fi
print_success "RPC URL configured"

# Set RPC based on network
if [ "$NETWORK" = "amoy" ]; then
    RPC_URL=$AMOY_RPC_URL
    CHAIN_ID=80002
    EXPLORER="https://amoy.polygonscan.com"
elif [ "$NETWORK" = "polygon" ]; then
    RPC_URL=$POLYGON_RPC_URL
    CHAIN_ID=137
    EXPLORER="https://polygonscan.com"
else
    print_error "Unknown network: $NETWORK"
    print_info "Supported networks: amoy, polygon"
    exit 1
fi

print_success "Network: $NETWORK (Chain ID: $CHAIN_ID)"

# Check balance
print_header "CHECKING DEPLOYER BALANCE"
BALANCE=$(cast balance $ADMIN_ADDRESS --rpc-url $RPC_URL)
BALANCE_ETH=$(cast from-wei $BALANCE)
print_info "Balance: $BALANCE_ETH MATIC"

if (( $(echo "$BALANCE_ETH < 0.03" | bc -l) )); then
    print_warning "Low balance! Recommended: 0.5+ MATIC"
    if [ "$NETWORK" = "amoy" ]; then
        print_info "Get testnet MATIC from: https://faucet.polygon.technology/"
    fi
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check RPC connection
print_header "CHECKING RPC CONNECTION"
BLOCK_NUMBER=$(cast block-number --rpc-url $RPC_URL)
print_success "Connected to network (Block: $BLOCK_NUMBER)"

# Build contracts
print_header "BUILDING CONTRACTS"
forge build
print_success "Contracts compiled"

# Run tests
print_header "RUNNING TESTS"
if forge test; then
    print_success "All tests passed"
else
    print_error "Tests failed!"
    read -p "Continue deployment anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Confirm deployment
print_header "READY TO DEPLOY"
print_info "Network: $NETWORK ($CHAIN_ID)"
print_info "RPC: $RPC_URL"
print_info "Deployer: $ADMIN_ADDRESS"
print_info "Balance: $BALANCE_ETH MATIC"
echo ""
print_warning "This will deploy all TYT V2 contracts!"
echo ""
read -p "Continue with deployment? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled"
    exit 0
fi

# Deploy contracts
print_header "DEPLOYING CONTRACTS"

if [ -z "$POLYGONSCAN_API_KEY" ]; then
    print_warning "POLYGONSCAN_API_KEY not set - deploying without verification"
    forge script script/DeployV3WithFeeConfig.s.sol:DeployV3WithFeeConfig \
        --rpc-url $RPC_URL \
        --broadcast \
        -vvvv
else
    print_info "Deploying with automatic verification"
    forge script script/DeployV3WithFeeConfig.s.sol:DeployV3WithFeeConfig \
        --rpc-url $RPC_URL \
        --broadcast \
        --verify \
        --etherscan-api-key $POLYGONSCAN_API_KEY \
        -vvvv
fi

# Check if deployment was successful
if [ $? -eq 0 ]; then
    print_success "Deployment successful!"
else
    print_error "Deployment failed!"
    exit 1
fi

# Check for deployment file
DEPLOYMENT_FILE="deployments/${NETWORK}.json"
if [ -f "$DEPLOYMENT_FILE" ]; then
    print_header "DEPLOYMENT ADDRESSES"
    cat $DEPLOYMENT_FILE | jq '.'

    # Extract addresses
    FEE_CONFIG=$(cat $DEPLOYMENT_FILE | jq -r '.feeConfig')
    MINER_NFT=$(cat $DEPLOYMENT_FILE | jq -r '.minerNFT')
    MARKETPLACE=$(cat $DEPLOYMENT_FILE | jq -r '.marketplace')

    print_success "Contracts deployed to $NETWORK:"
    echo ""
    echo "  FeeConfig:    $FEE_CONFIG"
    echo "  MinerNFT:     $MINER_NFT"
    echo "  Marketplace:  $MARKETPLACE"
    echo ""
    print_info "View on explorer:"
    echo "  $EXPLORER/address/$FEE_CONFIG"
    echo ""
fi

# Next steps
print_header "NEXT STEPS"
echo "1. Verify contracts on PolygonScan (if not auto-verified)"
echo "   forge verify-contract <ADDRESS> <CONTRACT> --chain-id $CHAIN_ID"
echo ""
echo "2. Update frontend .env with contract addresses:"
echo "   VITE_FEE_CONFIG_ADDRESS=$FEE_CONFIG"
echo "   VITE_MINER_NFT_ADDRESS=$MINER_NFT"
echo "   VITE_MARKETPLACE_ADDRESS=$MARKETPLACE"
echo ""
echo "3. Test contract interactions:"
echo "   cast call $MINER_NFT \"name()\" --rpc-url $RPC_URL"
echo ""
echo "4. Run integration tests"
echo ""
print_success "Deployment complete! 🚀"
