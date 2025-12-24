#!/bin/bash

# TYT Platform Security Check Script
# This script performs comprehensive security checks on the codebase

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
ISSUES=0
WARNINGS=0

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                TYT Platform Security Check                    ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print section header
print_section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    ((WARNINGS++))
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
    ((ISSUES++))
}

# 1. Check for sensitive files
print_section "1. Checking for Sensitive Files"

if [ -f ".env" ]; then
    if git ls-files --error-unmatch .env 2>/dev/null; then
        print_error ".env file is tracked in git! CRITICAL SECURITY ISSUE!"
    else
        print_success ".env file exists but not tracked in git"
    fi
else
    print_warning ".env file not found"
fi

if [ -f ".env.example" ]; then
    print_success ".env.example exists for reference"
else
    print_warning ".env.example not found"
fi

# Check for accidentally committed secrets
SECRET_FILES=("*.key" "*.pem" "*.p12" "private-keys/*" "secrets/*" "mnemonic.txt")
for pattern in "${SECRET_FILES[@]}"; do
    if git ls-files "$pattern" 2>/dev/null | grep -q .; then
        print_error "Secret files matching '$pattern' found in git!"
    fi
done

if [ $ISSUES -eq 0 ]; then
    print_success "No sensitive files in git"
fi

# 2. Check for hardcoded secrets in code
print_section "2. Checking for Hardcoded Secrets"

# Check for API keys
if grep -rE "(api[_-]?key|apikey|secret[_-]?key|password).*=.*['\"][a-zA-Z0-9]{20,}" src/ 2>/dev/null; then
    print_error "Potential hardcoded secrets found in src/"
else
    print_success "No hardcoded secrets detected in src/"
fi

# Check for private keys
if grep -rE "(private[_-]?key|privateKey).*['\"][0-9a-fA-F]{64}" src/ 2>/dev/null; then
    print_error "Potential private keys found in code!"
else
    print_success "No private keys in code"
fi

# 3. Check for XSS vulnerabilities
print_section "3. Checking for XSS Vulnerabilities"

# Check dangerouslySetInnerHTML usage
DANGEROUS_HTML=$(grep -r "dangerouslySetInnerHTML" src/ 2>/dev/null | wc -l)
if [ "$DANGEROUS_HTML" -gt 0 ]; then
    print_warning "Found $DANGEROUS_HTML uses of dangerouslySetInnerHTML"

    # Check if DOMPurify is used
    if grep -r "DOMPurify.sanitize" src/ 2>/dev/null | wc -l | grep -q "[1-9]"; then
        print_success "DOMPurify sanitization is being used"
    else
        print_error "dangerouslySetInnerHTML used WITHOUT DOMPurify!"
    fi
else
    print_success "No dangerouslySetInnerHTML usage found"
fi

# 4. Check for SQL injection risks
print_section "4. Checking for SQL Injection Risks"

if grep -rE "(sql\`|SELECT.*FROM|INSERT INTO|UPDATE.*SET|DELETE FROM)" src/ 2>/dev/null; then
    print_error "Direct SQL queries found! Should use Supabase client"
else
    print_success "No direct SQL queries in src/"
fi

# 5. Check for eval and Function() usage
print_section "5. Checking for Dangerous Functions"

if grep -rE "(eval\(|Function\(|setTimeout\([^)]*\bstring|setInterval\([^)]*\bstring)" src/ 2>/dev/null; then
    print_error "Dangerous functions (eval, Function) found!"
else
    print_success "No dangerous functions detected"
fi

# 6. Check for external CDN usage
print_section "6. Checking for External CDN Dependencies"

EXTERNAL_RESOURCES=$(grep -rE "https?://[^\"']*\.(js|css)" src/ public/ 2>/dev/null | grep -v "//api\|//rpc\|//explorer" || true)
if [ -n "$EXTERNAL_RESOURCES" ]; then
    print_warning "External resources found:"
    echo "$EXTERNAL_RESOURCES"
else
    print_success "No external CDN dependencies"
fi

# 7. Check npm dependencies
print_section "7. Checking NPM Dependencies"

if [ -f "package-lock.json" ]; then
    print_success "package-lock.json exists"

    echo "Running npm audit..."
    if npm audit --audit-level=high 2>&1; then
        print_success "No high/critical vulnerabilities"
    else
        print_error "High or critical vulnerabilities found!"
        echo "Run: npm audit fix"
    fi
else
    print_error "package-lock.json not found!"
fi

# 8. Check for outdated packages
print_section "8. Checking for Outdated Packages"

OUTDATED=$(npm outdated 2>/dev/null | tail -n +2 | wc -l)
if [ "$OUTDATED" -gt 0 ]; then
    print_warning "$OUTDATED packages are outdated"
    echo "Run: npm outdated for details"
else
    print_success "All packages are up to date"
fi

# 9. Check TypeScript compilation
print_section "9. Checking TypeScript"

if npm run typecheck 2>&1 | tail -n 5; then
    print_success "TypeScript check passed"
else
    print_error "TypeScript errors found"
fi

# 10. Check ESLint
print_section "10. Running ESLint"

if npm run lint 2>&1 | tail -n 10; then
    print_success "ESLint check passed"
else
    print_error "ESLint errors found"
fi

# 11. Test build
print_section "11. Testing Build"

if npm run build 2>&1 | tail -n 5; then
    print_success "Build successful"
else
    print_error "Build failed"
fi

# 12. Check .gitignore
print_section "12. Verifying .gitignore"

REQUIRED_IGNORES=(".env" ".env.*" "node_modules" "dist" "*.key" "*.pem" "secrets/")
for item in "${REQUIRED_IGNORES[@]}"; do
    if grep -q "$item" .gitignore; then
        print_success "$item is in .gitignore"
    else
        print_error "$item is NOT in .gitignore!"
    fi
done

# 13. Check for CORS issues
print_section "13. Checking CORS Configuration"

if grep -r "Access-Control-Allow-Origin.*\*" src/ 2>/dev/null; then
    print_warning "CORS allows all origins (*) - ensure this is intentional"
else
    print_success "No wildcard CORS found"
fi

# 14. Check RLS policies in migrations
print_section "14. Checking RLS Policies"

RLS_ENABLED=$(grep -r "ENABLE ROW LEVEL SECURITY" supabase/migrations/ 2>/dev/null | wc -l)
if [ "$RLS_ENABLED" -gt 0 ]; then
    print_success "Found $RLS_ENABLED tables with RLS enabled"
else
    print_warning "No RLS policies found in migrations"
fi

# 15. Check for authentication checks
print_section "15. Checking Authentication Implementation"

if grep -r "auth\.uid()" supabase/migrations/ src/ 2>/dev/null | wc -l | grep -q "[1-9]"; then
    print_success "Authentication checks found"
else
    print_warning "Few or no auth.uid() checks found"
fi

# Summary
print_section "Security Check Summary"

echo ""
if [ $ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          ✓ ALL SECURITY CHECKS PASSED!                    ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    exit 0
elif [ $ISSUES -eq 0 ]; then
    echo -e "${YELLOW}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ⚠ $WARNINGS Warning(s) Found - Review Recommended        ║${NC}"
    echo -e "${YELLOW}╚═══════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ✗ $ISSUES Critical Issue(s) Found!                       ║${NC}"
    echo -e "${RED}║  ⚠ $WARNINGS Warning(s) Found                             ║${NC}"
    echo -e "${RED}║                                                           ║${NC}"
    echo -e "${RED}║  Please fix issues before deployment!                    ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
