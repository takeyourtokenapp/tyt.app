#!/bin/bash
# ============================================
# TYT PLATFORM - PRE-COMMIT SECURITY VERIFICATION
# ============================================
# Run this script BEFORE every git commit
# Usage: bash verify-security.sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 TYT SECURITY VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ERRORS=0

# ============================================
# 1. CHECK .env IS NOT STAGED
# ============================================
echo "📝 [1/6] Checking .env file status..."

if git status --porcelain 2>/dev/null | grep -q "^[AM]. .env$"; then
    echo "❌ CRITICAL: .env is staged for commit!"
    echo "   Run: git reset HEAD .env"
    ERRORS=$((ERRORS + 1))
elif [ -f .env ]; then
    echo "✅ .env exists but not staged (good)"
else
    echo "⚠️  .env not found (create from .env.example)"
fi

# ============================================
# 2. CHECK .gitignore
# ============================================
echo ""
echo "📝 [2/6] Checking .gitignore..."

REQUIRED_PATTERNS=(".env" "*.key" "*.pem" "*.p12" "wallets/" "keystore/" "secrets/" "credentials/")
MISSING_PATTERNS=()

for pattern in "${REQUIRED_PATTERNS[@]}"; do
    if ! grep -q "^${pattern}$" .gitignore 2>/dev/null; then
        MISSING_PATTERNS+=("$pattern")
    fi
done

if [ ${#MISSING_PATTERNS[@]} -eq 0 ]; then
    echo "✅ All security patterns in .gitignore"
else
    echo "❌ CRITICAL: Missing patterns in .gitignore:"
    for pattern in "${MISSING_PATTERNS[@]}"; do
        echo "   - $pattern"
    done
    ERRORS=$((ERRORS + 1))
fi

# ============================================
# 3. SCAN TYPESCRIPT FOR HARDCODED SECRETS
# ============================================
echo ""
echo "📝 [3/6] Scanning TypeScript files for hardcoded secrets..."

FOUND_SECRETS=$(grep -r "PRIVATE_KEY\|API_KEY\|SECRET" src/ --include="*.ts" --include="*.tsx" 2>/dev/null \
    | grep -v "import.meta.env" \
    | grep -v "process.env" \
    | grep -v "// " \
    | grep -v "interface\|type\|comment\|import.*from" \
    | grep -v "\.d\.ts:" \
    || true)

if [ -z "$FOUND_SECRETS" ]; then
    echo "✅ No hardcoded secrets in TypeScript"
else
    echo "⚠️  Potential secrets found (review manually):"
    echo "$FOUND_SECRETS" | head -3
    echo "   (These might be false positives - verify manually)"
fi

# ============================================
# 4. SCAN EDGE FUNCTIONS
# ============================================
echo ""
echo "📝 [4/6] Scanning Edge Functions..."

FOUND_EDGE_SECRETS=$(grep -r "const.*=.*['\"].*[a-zA-Z0-9]{32,}" supabase/functions/ --include="*.ts" 2>/dev/null \
    | grep -v "Deno.env" \
    | grep -v "//" \
    | grep -v "http" \
    | grep -v "noreply@" \
    || true)

if [ -z "$FOUND_EDGE_SECRETS" ]; then
    echo "✅ No hardcoded secrets in Edge Functions"
else
    echo "⚠️  Potential secrets in Edge Functions:"
    echo "$FOUND_EDGE_SECRETS" | head -3
fi

# ============================================
# 5. CHECK BUILD
# ============================================
echo ""
echo "📝 [5/6] Running build test..."

if npm run build >/dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ CRITICAL: Build failed!"
    echo "   Run: npm run build (to see errors)"
    ERRORS=$((ERRORS + 1))
fi

# ============================================
# 6. CHECK FOR OLD COMPROMISED KEYS
# ============================================
echo ""
echo "📝 [6/6] Checking for old compromised keys..."

OLD_KEYS=$(grep -r "WeGn_wxfb\|0xd0d4582f\|3WTURGQ2PNAR" . --include="*.md" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "PRE_COMMIT_VERIFICATION.md:" | grep -v "verify-security.sh:" || true)

if [ -z "$OLD_KEYS" ]; then
    echo "✅ No old compromised keys found"
else
    echo "❌ CRITICAL: Old compromised keys found in files!"
    echo "   These must be removed before commit"
    ERRORS=$((ERRORS + 1))
fi

# ============================================
# FINAL RESULT
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo "✅ ALL CHECKS PASSED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Safe to commit! 🚀"
    echo ""
    echo "Next steps:"
    echo "  git add ."
    echo "  git commit -m \"Your message\""
    echo "  git push"
    exit 0
else
    echo "❌ FAILED: $ERRORS CRITICAL ISSUES FOUND"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "DO NOT COMMIT until all issues are fixed!"
    echo ""
    echo "For help, see:"
    echo "  - PRE_COMMIT_VERIFICATION.md"
    echo "  - EMERGENCY_KEY_COMPROMISE.md"
    exit 1
fi
