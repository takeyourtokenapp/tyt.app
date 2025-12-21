#!/bin/bash
# TYT V3 - Documentation Cleanup Script
# Removes outdated and duplicate documentation files

echo "🗑️  Starting cleanup..."

# Create archive directory
mkdir -p archive/old-docs

# Move outdated files to archive
FILES_TO_ARCHIVE=(
  "ACADEMY_COMPLETE_UPDATE.md"
  "ACADEMY_FIXED.md"
  "ANALYSIS_CURRENT_SESSION.md"
  "AUTH_FIX_COMPLETE.md"
  "AUTH_SETTINGS_FIX.md"
  "BUILD_STATUS.md"
  "CAROUSEL_FINAL_UPDATE.md"
  "CONTRACT_FIXES_NEEDED.md"
  "CURRENT_STATUS.md"
  "DATABASE_SYNC_AUDIT_REPORT.md"
  "DEEP_INTEGRATION_REPORT.md"
  "DEPLOYMENT_CHECKLIST.md"
  "DEPLOYMENT_READY.md"
  "ECOSYSTEM_COMPLETE_STATUS.md"
  "ECOSYSTEM_INTEGRATION_COMPLETE.md"
  "ENHANCED_TICKER_UPDATE.md"
  "ENVIRONMENT_VARIABLES_REPORT.md"
  "FINAL_ANALYSIS_REPORT.md"
  "FINAL_PROMPT_PACK_README.md"
  "FINAL_SUMMARY.md"
  "FINAL_UPDATE_SUMMARY.md"
  "FRONTEND_ANALYSIS_COMPLETE.md"
  "FULL_PLATFORM_ANALYSIS.md"
  "FULL_READINESS_REPORT.md"
  "IMPLEMENTATION_COMPLETE.md"
  "IMPLEMENTATION_SUMMARY_FINAL.md"
  "IMPROVEMENTS_COMPLETE.md"
  "INTEGRATION_SUMMARY.md"
  "LOGIN_CREDENTIALS.md"
  "LOGIN_FIX_COMPLETE.md"
  "MICRO_PROMPTS_ALIGNMENT.md"
  "NAMING_INCONSISTENCIES_VISUAL.md"
  "PLATFORM_AUDIT_COMPLETE.md"
  "PROJECT_CLEANUP_REPORT.md"
  "PROMPTS_V3_READY.md"
  "QUICK_ALIGNMENT_SUMMARY.md"
  "QUICK_TEST_GUIDE.md"
  "SECRETS_AUDIT_FINAL.md"
  "SECRETS_SETUP_GUIDE.md"
  "SECRETS_STATUS.md"
  "SECURITY_AUDIT_COMPLETE.md"
  "SECURITY_AUDIT_FINAL_CORRECTED.md"
  "SMART_CONTRACT_SYNC_REPORT.md"
  "SYNC_STATUS_SUMMARY.md"
  "TEST_LOGIN_NOW.md"
  "TYT_V2_MASTER_BLUEPRINT.md"
  "UNIFIED_WALLET_ACADEMY_UPDATE.md"
  "UX_IMPROVEMENTS.md"
  "V3_FINAL_INTEGRATION_REPORT.md"
  "V3_INTEGRATION_COMPLETE.md"
  "V3_INTEGRATION_STATUS.md"
  "V3_QUICK_START.md"
  "V3_README.md"
  "WALLET_COMPONENTS_COMPLETE.md"
  "WALLET_NETWORKS_FIXED.md"
  "WALLET_TRADING_FIXED.md"
  "WALLET_TYT_FULLY_FIXED.md"
  "БЕЛЫЙ_ЭКРАН_ИСПРАВЛЕН.md"
  "КРИТИЧЕСКИЕ_ИСПРАВЛЕНИЯ_ГОТОВЫ.md"
  "СДЕЛАТЬ_ПРЯМО_СЕЙЧАС.md"
  "CONTRACT_SYNC_SUMMARY.txt"
  "README_CONTRACT_SYNC.txt"
  "V3_INTEGRATION_DONE.txt"
  "V3_SUMMARY.txt"
  "APPLY_ACADEMY_NOW.sql"
)

COUNT=0
for file in "${FILES_TO_ARCHIVE[@]}"; do
  if [ -f "$file" ]; then
    mv "$file" archive/old-docs/
    echo "✓ Archived: $file"
    ((COUNT++))
  fi
done

echo ""
echo "✅ Cleanup complete!"
echo "📦 Archived $COUNT files to archive/old-docs/"
echo ""
echo "Remaining documentation files:"
find . -maxdepth 1 -name "*.md" -type f | wc -l
