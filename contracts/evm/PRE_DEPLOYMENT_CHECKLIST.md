# ✅ PRE-DEPLOYMENT CHECKLIST

Complete this checklist before deploying TYT V2 contracts to any network.

---

## 🔐 SECURITY CHECKS

### Code Security
- [ ] All contracts compile without errors
- [ ] All tests pass (100% coverage)
- [ ] No high-severity warnings from slither/mythril
- [ ] Access control properly implemented
- [ ] Reentrancy guards in place where needed
- [ ] Integer overflow/underflow protected
- [ ] Gas optimization reviewed
- [ ] Emergency pause mechanism tested

```bash
# Run security checks
forge build
forge test
forge test --gas-report
```

### Contract Review
- [ ] FeeConfigGovernance timelock working (2 days)
- [ ] Fee percentages sum to 100% (60/30/10)
- [ ] Roles assigned correctly (admin, educator)
- [ ] Multi-sig addresses configured (if using)
- [ ] Upgrade mechanism reviewed (if upgradeable)
- [ ] Event emissions verified
- [ ] Error handling comprehensive

---

## ⚙️ CONFIGURATION CHECKS

### Environment Setup
- [ ] `.env` file created from `.env.example`
- [ ] `PRIVATE_KEY` set (deployer wallet)
- [ ] `AMOY_RPC_URL` set (Alchemy/Infura)
- [ ] `POLYGONSCAN_API_KEY` set
- [ ] All wallet addresses valid (checksummed)
- [ ] Fee basis points configured correctly
- [ ] Timelock duration appropriate

```bash
# Verify .env configuration
source .env
echo "RPC: $AMOY_RPC_URL"
echo "Admin: $ADMIN_ADDRESS"
echo "Protocol: $PROTOCOL_TREASURY"
echo "Charity: $CHARITY_VAULT"
echo "Academy: $ACADEMY_VAULT"
```

### Wallet Configuration
- [ ] Deployer wallet address recorded
- [ ] Deployer has sufficient MATIC (0.5+ recommended)
- [ ] Protocol treasury address set
- [ ] Charity vault address set
- [ ] Academy vault address set
- [ ] Admin address set (same as deployer or multi-sig)

```bash
# Check deployer balance
cast balance $ADMIN_ADDRESS --rpc-url $AMOY_RPC_URL
```

### Fee Configuration
- [ ] Mint fee: 150 bps (1.5%) ✓
- [ ] Marketplace fee: 250 bps (2.5%) ✓
- [ ] Withdrawal fee: 50 bps (0.5%) ✓
- [ ] Maintenance fee: 100 bps (1.0%) ✓
- [ ] Deposit fee: 100 bps (1.0%) ✓
- [ ] Protocol split: 60% ✓
- [ ] Charity split: 30% ✓
- [ ] Academy split: 10% ✓

---

## 🌐 NETWORK CHECKS

### RPC Connection
- [ ] RPC URL accessible
- [ ] Latest block number retrieved
- [ ] Network ID correct (80002 for Amoy)
- [ ] Gas price reasonable
- [ ] No network congestion

```bash
# Test RPC connection
cast block-number --rpc-url $AMOY_RPC_URL
cast chain-id --rpc-url $AMOY_RPC_URL
cast gas-price --rpc-url $AMOY_RPC_URL
```

### Block Explorer
- [ ] PolygonScan API accessible
- [ ] API key valid
- [ ] Rate limits understood
- [ ] Verification endpoint working

```bash
# Test API key
curl "https://api-amoy.polygonscan.com/api?module=account&action=balance&address=$ADMIN_ADDRESS&apikey=$POLYGONSCAN_API_KEY"
```

### Testnet Preparation
- [ ] Faucet MATIC received
- [ ] Test transaction sent successfully
- [ ] Sufficient gas for deployment (~0.03 MATIC)
- [ ] Backup RPC URL configured

---

## 📝 DOCUMENTATION CHECKS

### Code Documentation
- [ ] All contracts have NatSpec comments
- [ ] Public functions documented
- [ ] Complex logic explained
- [ ] Security considerations noted
- [ ] Known limitations documented

### Deployment Documentation
- [ ] Deployment script reviewed
- [ ] Constructor parameters validated
- [ ] Post-deployment steps documented
- [ ] Emergency procedures documented
- [ ] Contact information updated

---

## 🧪 TESTING CHECKS

### Unit Tests
- [ ] All unit tests pass
- [ ] Edge cases covered
- [ ] Failure scenarios tested
- [ ] Gas costs within limits
- [ ] Events emitted correctly

```bash
# Run all tests
forge test -vvv
```

### Integration Tests
- [ ] Mint → Fee distribution works
- [ ] Marketplace → Fee distribution works
- [ ] Governance → Proposal → Execution works
- [ ] Timelock → Emergency update works
- [ ] Academy → Student rewards work
- [ ] Charity → Withdrawal works

### Simulation Tests
- [ ] Dry run deployment successful
- [ ] All contracts deploy in order
- [ ] Addresses saved correctly
- [ ] No revert reasons encountered

```bash
# Simulate deployment
forge script script/DeployV3WithFeeConfig.s.sol:DeployV3WithFeeConfig --rpc-url $AMOY_RPC_URL -vvvv
```

---

## 💰 FINANCIAL CHECKS

### Fee Structure Validation
- [ ] Fee percentages commercially viable
- [ ] Charity receives 30% consistently
- [ ] Academy receives 10% consistently
- [ ] Protocol receives 60% consistently
- [ ] Rounding errors minimized

### Economic Model
- [ ] Token economics reviewed
- [ ] Incentive structure sound
- [ ] No exploitable arbitrage
- [ ] Sustainability verified
- [ ] Burn mechanism (if any) tested

---

## 🎯 DEPLOYMENT STRATEGY

### Deployment Order
- [ ] FeeConfigGovernance first
- [ ] CharityVault second
- [ ] AcademyVault third
- [ ] MinerNFT fourth (depends on FeeConfig)
- [ ] MinerMarketplace fifth (depends on NFT + FeeConfig)
- [ ] RewardsMerkleRegistry sixth

### Post-Deployment Verification
- [ ] All contracts deployed successfully
- [ ] All contracts verified on PolygonScan
- [ ] Addresses saved to `deployments/amoy.json`
- [ ] Frontend `.env` updated
- [ ] Test transactions executed
- [ ] Fee distributions confirmed

```bash
# After deployment, verify
cat deployments/amoy.json
cast code $FEE_CONFIG_ADDRESS --rpc-url $AMOY_RPC_URL
```

---

## 🚨 RISK MANAGEMENT

### Potential Risks
- [ ] Deployer key compromise plan
- [ ] Contract bug discovery plan
- [ ] Emergency pause procedure
- [ ] Fund recovery mechanism
- [ ] Community communication plan

### Backup Plans
- [ ] Alternative RPC providers listed
- [ ] Secondary deployer wallet prepared
- [ ] Rollback strategy documented
- [ ] Support contacts available

---

## 📊 MONITORING SETUP

### On-Chain Monitoring
- [ ] Tenderly alerts configured
- [ ] Block explorer bookmarks saved
- [ ] Transaction monitoring enabled
- [ ] Fee distribution tracking

### Off-Chain Monitoring
- [ ] Frontend monitoring (Sentry)
- [ ] Backend monitoring (Datadog/New Relic)
- [ ] Database monitoring (Supabase)
- [ ] Uptime monitoring (UptimeRobot)

---

## 🎓 TEAM PREPARATION

### Knowledge Transfer
- [ ] All team members trained
- [ ] Admin operations documented
- [ ] Emergency procedures reviewed
- [ ] Support rotation scheduled

### Communication
- [ ] Community informed about deployment
- [ ] Social media posts prepared
- [ ] Announcement banners ready
- [ ] FAQ updated

---

## ✅ FINAL CHECKS

### Before Clicking "Deploy"

1. **Triple-check all addresses**
   ```bash
   echo "Protocol: $PROTOCOL_TREASURY"
   echo "Charity: $CHARITY_VAULT"
   echo "Academy: $ACADEMY_VAULT"
   echo "Admin: $ADMIN_ADDRESS"
   ```

2. **Verify deployer balance**
   ```bash
   cast balance $ADMIN_ADDRESS --rpc-url $AMOY_RPC_URL
   ```

3. **Confirm network**
   ```bash
   cast chain-id --rpc-url $AMOY_RPC_URL
   # Should be: 80002 (Amoy) or 137 (Polygon Mainnet)
   ```

4. **Review deployment command**
   ```bash
   forge script script/DeployV3WithFeeConfig.s.sol:DeployV3WithFeeConfig \
     --rpc-url $AMOY_RPC_URL \
     --broadcast \
     --verify \
     --etherscan-api-key $POLYGONSCAN_API_KEY \
     -vvvv
   ```

5. **Take a deep breath** 🧘

6. **Execute deployment** 🚀

---

## 📝 POST-DEPLOYMENT CHECKLIST

### Immediate (Within 5 minutes)
- [ ] Verify all contracts deployed
- [ ] Check PolygonScan for verification
- [ ] Save contract addresses securely
- [ ] Update frontend configuration
- [ ] Test basic interactions

### Short-term (Within 1 hour)
- [ ] Execute test transactions
- [ ] Verify fee distributions
- [ ] Test marketplace listing/buying
- [ ] Test governance proposal
- [ ] Monitor for any issues

### Medium-term (Within 24 hours)
- [ ] Full integration testing
- [ ] Load testing (if applicable)
- [ ] Community testing program
- [ ] Bug bounty program launched
- [ ] Marketing campaign begins

---

## 🎉 DEPLOYMENT SUCCESS CRITERIA

Your deployment is successful if:

✅ All 6 contracts deployed
✅ All contracts verified on PolygonScan
✅ Fee distribution working (60/30/10)
✅ Mint NFT → Fees collected
✅ Marketplace sale → Fees distributed
✅ Governance proposal → Executed after timelock
✅ No critical bugs found
✅ Community feedback positive

---

## 📞 EMERGENCY CONTACTS

### If Something Goes Wrong

1. **Pause all operations** (if pause mechanism exists)
2. **Notify team immediately**
3. **Document the issue**
4. **Check monitoring dashboards**
5. **Review recent transactions**
6. **Communicate with community**

### Support Resources

- **Foundry Docs:** https://book.getfoundry.sh/
- **Polygon Docs:** https://docs.polygon.technology/
- **OpenZeppelin Forum:** https://forum.openzeppelin.com/
- **Ethereum Stack Exchange:** https://ethereum.stackexchange.com/

---

## ✍️ SIGN-OFF

**Deployment Lead:** _____________________ Date: _______

**Security Reviewer:** ___________________ Date: _______

**Technical Lead:** ______________________ Date: _______

**Project Manager:** _____________________ Date: _______

---

**By completing this checklist, you confirm:**
- All security measures reviewed
- All tests passed
- All configurations verified
- Team prepared for deployment
- Emergency procedures in place

**Ready to deploy!** 🚀

---

**Version:** 2.0.0
**Last Updated:** December 14, 2025
**Network:** Polygon Amoy Testnet → Polygon Mainnet
