import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
const FROM_EMAIL = 'noreply@takeyourtoken.app';
const FROM_NAME = 'TakeYourToken';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EmailRequest {
  to: string;
  template: EmailTemplate;
  data: Record<string, any>;
}

type EmailTemplate =
  | 'welcome'
  | 'depositConfirmed'
  | 'withdrawalConfirmed'
  | 'withdrawalPending'
  | 'withdrawalApproved'
  | 'withdrawalRejected'
  | 'dailyRewards'
  | 'maintenanceInvoice'
  | 'kycStatusUpdate'
  | 'securityAlert'
  | 'foundationReceipt';

interface EmailTemplateData {
  subject: string;
  getHtml: (data: Record<string, any>) => string;
}

const templates: Record<EmailTemplate, EmailTemplateData> = {
  welcome: {
    subject: 'Welcome to TakeYourToken! 🎉',
    getHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0A1122 0%, #1a2744 100%); padding: 40px 20px; text-align: center; }
    .logo { color: #D2A44C; font-size: 32px; font-weight: bold; margin: 0; }
    .content { padding: 40px 30px; }
    .button { display: inline-block; padding: 12px 30px; background: #D2A44C; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
    .highlight { background: #fff8e1; padding: 20px; border-left: 4px solid #D2A44C; margin: 20px 0; }
    h1 { color: #0A1122; margin-top: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">⚔️ TakeYourToken</h1>
      <p style="color: #D2A44C; margin: 10px 0 0; font-size: 16px;">Your Web3 Mining Journey Begins</p>
    </div>

    <div class="content">
      <h1>Welcome, ${data.name || 'Warrior'}!</h1>

      <p>Thank you for joining <strong>TakeYourToken</strong> - the first Web3 mining platform that combines Bitcoin mining rewards with supporting children's brain cancer research.</p>

      <div class="highlight">
        <strong>🎯 Your Mission:</strong> Mine Bitcoin, earn rewards, and support life-saving research - all in one ecosystem.
      </div>

      <h2>Getting Started:</h2>
      <ol>
        <li><strong>Complete Your Profile</strong> - Set up KYC for higher withdrawal limits</li>
        <li><strong>Get Your First Miner</strong> - Browse our marketplace and purchase an NFT miner</li>
        <li><strong>Start Earning</strong> - Receive daily BTC rewards automatically</li>
        <li><strong>Learn & Grow</strong> - Visit our Academy to master Web3 and blockchain</li>
      </ol>

      <div style="text-align: center;">
        <a href="https://takeyourtoken.app/app/dashboard" class="button">Go to Dashboard</a>
      </div>

      <div class="highlight">
        <strong>💎 Special Feature:</strong> Every transaction you make automatically supports our Children's Brain Cancer Research Foundation.
      </div>

      <h2>Need Help?</h2>
      <p>Our support team is here 24/7:</p>
      <ul>
        <li>📧 Email: support@takeyourtoken.app</li>
        <li>💬 Discord: discord.gg/takeyourtoken</li>
        <li>📚 Help Center: takeyourtoken.app/help</li>
      </ul>
    </div>

    <div class="footer">
      <p><strong>TakeYourToken</strong> - Mining Bitcoin, Supporting Research, Building Community</p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        You received this email because you registered at TakeYourToken.<br>
        © 2024 TakeYourToken. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  },

  depositConfirmed: {
    subject: 'Deposit Confirmed - {{amount}} {{asset}}',
    getHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center; color: white; }
    .content { padding: 40px 30px; }
    .transaction-box { background: #f8fffe; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .amount { font-size: 36px; font-weight: bold; color: #10b981; margin: 10px 0; }
    .detail { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail:last-child { border-bottom: none; }
    .label { color: #666; }
    .value { font-weight: 600; color: #0A1122; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
    .explorer-link { display: inline-block; padding: 10px 20px; background: #0A1122; color: white; text-decoration: none; border-radius: 6px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">✅ Deposit Confirmed</h1>
      <p style="margin: 10px 0 0; opacity: 0.9;">Your funds have been successfully deposited</p>
    </div>

    <div class="content">
      <div class="transaction-box">
        <div style="text-align: center;">
          <div class="amount">${data.amount} ${data.asset}</div>
          <p style="color: #666;">Successfully deposited to your wallet</p>
        </div>

        <div class="detail">
          <span class="label">Asset:</span>
          <span class="value">${data.asset}</span>
        </div>
        <div class="detail">
          <span class="label">Amount:</span>
          <span class="value">${data.amount}</span>
        </div>
        <div class="detail">
          <span class="label">Network:</span>
          <span class="value">${data.network || 'Mainnet'}</span>
        </div>
        <div class="detail">
          <span class="label">Fee Paid:</span>
          <span class="value">${data.fee || '0'} ${data.asset} (${data.feePercent || '0'}%)</span>
        </div>
        <div class="detail">
          <span class="label">New Balance:</span>
          <span class="value">${data.newBalance} ${data.asset}</span>
        </div>
        <div class="detail">
          <span class="label">Transaction:</span>
          <span class="value" style="font-size: 12px; word-break: break-all;">${data.txHash || 'Processing...'}</span>
        </div>
      </div>

      ${data.explorerUrl ? `
      <div style="text-align: center;">
        <a href="${data.explorerUrl}" class="explorer-link" target="_blank">View on Block Explorer</a>
      </div>
      ` : ''}

      <div style="background: #fff8e1; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>🎯 What's Next?</strong>
        <ul style="margin: 10px 0 0; padding-left: 20px;">
          <li>Purchase NFT miners to start earning BTC</li>
          <li>Stake your TYT tokens for governance</li>
          <li>Visit the Academy to learn more</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p><strong>TakeYourToken</strong></p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">
        © 2024 TakeYourToken. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  },

  withdrawalConfirmed: {
    subject: 'Withdrawal Completed - {{amount}} {{asset}}',
    getHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px 20px; text-align: center; color: white; }
    .content { padding: 40px 30px; }
    .transaction-box { background: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .amount { font-size: 36px; font-weight: bold; color: #3b82f6; margin: 10px 0; }
    .detail { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail:last-child { border-bottom: none; }
    .label { color: #666; }
    .value { font-weight: 600; color: #0A1122; word-break: break-all; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
    .explorer-link { display: inline-block; padding: 10px 20px; background: #0A1122; color: white; text-decoration: none; border-radius: 6px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🚀 Withdrawal Completed</h1>
      <p style="margin: 10px 0 0; opacity: 0.9;">Your funds have been sent successfully</p>
    </div>

    <div class="content">
      <div class="transaction-box">
        <div style="text-align: center;">
          <div class="amount">${data.amount} ${data.asset}</div>
          <p style="color: #666;">Successfully sent to your destination</p>
        </div>

        <div class="detail">
          <span class="label">Asset:</span>
          <span class="value">${data.asset}</span>
        </div>
        <div class="detail">
          <span class="label">Amount:</span>
          <span class="value">${data.amount}</span>
        </div>
        <div class="detail">
          <span class="label">Network Fee:</span>
          <span class="value">${data.fee || '0'} ${data.asset}</span>
        </div>
        <div class="detail">
          <span class="label">Destination:</span>
          <span class="value" style="font-size: 12px;">${data.destination}</span>
        </div>
        <div class="detail">
          <span class="label">Transaction:</span>
          <span class="value" style="font-size: 12px;">${data.txHash}</span>
        </div>
        <div class="detail">
          <span class="label">Remaining Balance:</span>
          <span class="value">${data.remainingBalance} ${data.asset}</span>
        </div>
      </div>

      ${data.explorerUrl ? `
      <div style="text-align: center;">
        <a href="${data.explorerUrl}" class="explorer-link" target="_blank">View on Block Explorer</a>
      </div>
      ` : ''}

      <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>⚠️ Important Security Note:</strong>
        <p style="margin: 10px 0 0;">If you did not initiate this withdrawal, please contact our support team immediately at security@takeyourtoken.app</p>
      </div>
    </div>

    <div class="footer">
      <p><strong>TakeYourToken</strong></p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">
        © 2024 TakeYourToken. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  },

  withdrawalPending: {
    subject: 'Withdrawal Pending Admin Approval',
    getHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px 20px; text-align: center; color: white; }
    .content { padding: 40px 30px; }
    .info-box { background: #fffbeb; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">⏳ Withdrawal Pending Review</h1>
      <p style="margin: 10px 0 0; opacity: 0.9;">Your withdrawal requires manual approval</p>
    </div>

    <div class="content">
      <p>Hello ${data.userName || 'there'},</p>

      <p>Your withdrawal request for <strong>${data.amount} ${data.asset}</strong> has been received and is currently pending admin approval.</p>

      <div class="info-box">
        <h3 style="margin-top: 0;">📋 Request Details:</h3>
        <p><strong>Amount:</strong> ${data.amount} ${data.asset}</p>
        <p><strong>Destination:</strong> ${data.destination}</p>
        <p><strong>Reason for Review:</strong> ${data.reason || 'Amount exceeds auto-approval limit'}</p>
      </div>

      <h3>⏱️ What Happens Next?</h3>
      <ul>
        <li>Our team will review your request within <strong>24 hours</strong></li>
        <li>You'll receive an email once approved or if additional information is needed</li>
        <li>Your funds remain secure in your wallet until approval</li>
      </ul>

      <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>💡 Why Manual Review?</strong>
        <p style="margin: 10px 0 0;">Large withdrawals require manual verification for your security and compliance with regulatory requirements.</p>
      </div>

      <p>If you have any questions, please contact our support team at support@takeyourtoken.app</p>
    </div>

    <div class="footer">
      <p><strong>TakeYourToken</strong></p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">
        © 2024 TakeYourToken. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  },

  withdrawalApproved: {
    subject: 'Withdrawal Approved ✅',
    getHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center; color: white; }
    .content { padding: 40px 30px; }
    .success-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">✅ Withdrawal Approved!</h1>
      <p style="margin: 10px 0 0; opacity: 0.9;">Your withdrawal is being processed</p>
    </div>

    <div class="content">
      <div class="success-box">
        <h2 style="color: #10b981; margin-top: 0;">Great News!</h2>
        <p>Your withdrawal of <strong>${data.amount} ${data.asset}</strong> has been approved and is now being processed.</p>
      </div>

      <p>You will receive another email with the transaction details once the withdrawal is completed on the blockchain.</p>

      <p><strong>Estimated Processing Time:</strong> 10-30 minutes depending on network congestion</p>
    </div>

    <div class="footer">
      <p><strong>TakeYourToken</strong></p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">
        © 2024 TakeYourToken. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  },

  withdrawalRejected: {
    subject: 'Withdrawal Request Not Approved',
    getHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px 20px; text-align: center; color: white; }
    .content { padding: 40px 30px; }
    .warning-box { background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">❌ Withdrawal Not Approved</h1>
    </div>

    <div class="content">
      <p>Hello ${data.userName || 'there'},</p>

      <p>Unfortunately, your withdrawal request for <strong>${data.amount} ${data.asset}</strong> could not be approved at this time.</p>

      <div class="warning-box">
        <h3 style="margin-top: 0;">📋 Reason:</h3>
        <p>${data.reason || 'Unable to verify the withdrawal request. Please contact support for details.'}</p>
      </div>

      <h3>🔄 Next Steps:</h3>
      <ul>
        <li>Your funds remain safe in your wallet</li>
        <li>Contact our support team for clarification: support@takeyourtoken.app</li>
        <li>Ensure your KYC documents are up to date</li>
        <li>You can submit a new withdrawal request after addressing the issue</li>
      </ul>

      <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>💡 Need Help?</strong>
        <p style="margin: 10px 0 0;">Our support team is here to assist you. Reply to this email or contact us at support@takeyourtoken.app</p>
      </div>
    </div>

    <div class="footer">
      <p><strong>TakeYourToken</strong></p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">
        © 2024 TakeYourToken. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  },

  dailyRewards: {
    subject: 'Daily Mining Rewards - {{btc_amount}} BTC',
    getHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px 20px; text-align: center; color: white; }
    .content { padding: 40px 30px; }
    .reward-box { background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #f97316; border-radius: 8px; padding: 25px; margin: 20px 0; text-align: center; }
    .btc-amount { font-size: 42px; font-weight: bold; color: #f97316; margin: 15px 0; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat { text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; color: #0A1122; }
    .stat-label { color: #666; font-size: 12px; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">⛏️ Daily Mining Report</h1>
      <p style="margin: 10px 0 0; opacity: 0.9;">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
    </div>

    <div class="content">
      <h2>Your Daily Earnings</h2>

      <div class="reward-box">
        <p style="margin: 0; color: #666;">Today's BTC Rewards</p>
        <div class="btc-amount">₿ ${data.btcAmount}</div>
        <p style="margin: 0; color: #666;">≈ $${data.usdValue || '0.00'} USD</p>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-value">${data.minersCount || 0}</div>
          <div class="stat-label">Active Miners</div>
        </div>
        <div class="stat">
          <div class="stat-value">${data.totalHashrate || 0} TH/s</div>
          <div class="stat-label">Total Hashrate</div>
        </div>
        <div class="stat">
          <div class="stat-value">${data.discount || 0}%</div>
          <div class="stat-label">Discount Applied</div>
        </div>
      </div>

      <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>💰 Monthly Progress:</strong>
        <p style="margin: 10px 0 0;">This month: <strong>₿ ${data.monthlyTotal || '0.00000000'}</strong> (${data.monthlyDays || 0} days)</p>
      </div>

      <div style="background: #fff8e1; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>💎 Maximize Your Earnings:</strong>
        <ul style="margin: 10px 0 0; padding-left: 20px;">
          <li>Pay maintenance with TYT tokens for 20% discount</li>
          <li>Upgrade your miners for better efficiency</li>
          <li>Enable auto-reinvest to compound your earnings</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p><strong>TakeYourToken</strong> - Mining Bitcoin, Supporting Research</p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">
        © 2024 TakeYourToken. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  },

  maintenanceInvoice: {
    subject: 'Maintenance Invoice - {{amount}} TYT',
    getHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px 20px; text-align: center; color: white; }
    .content { padding: 40px 30px; }
    .invoice-box { background: #faf5ff; border: 2px solid #8b5cf6; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🔧 Monthly Maintenance Invoice</h1>
      <p style="margin: 10px 0 0; opacity: 0.9;">Invoice #${data.invoiceId || 'PENDING'}</p>
    </div>

    <div class="content">
      <div class="invoice-box">
        <h3 style="margin-top: 0;">Invoice Details:</h3>
        <p><strong>Period:</strong> ${data.period || 'Current Month'}</p>
        <p><strong>Active Miners:</strong> ${data.minersCount || 0}</p>
        <p><strong>Base Cost:</strong> ${data.baseCost || '0'} TYT</p>
        <p><strong>Discount Applied:</strong> -${data.discount || 0}%</p>
        <p><strong>Total Due:</strong> <strong style="color: #8b5cf6; font-size: 20px;">${data.amount} TYT</strong></p>
      </div>

      <p><strong>Payment Status:</strong> ${data.status === 'paid' ? '✅ Paid' : '⏳ Pending'}</p>

      ${data.status === 'paid' ? `
      <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>✅ Payment Confirmed</strong>
        <p style="margin: 10px 0 0;">Thank you! Your maintenance has been paid and your miners continue operating.</p>
      </div>
      ` : `
      <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>⚠️ Payment Required</strong>
        <p style="margin: 10px 0 0;">Please ensure sufficient TYT balance to maintain your miners.</p>
      </div>
      `}

      <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>💡 Save 20% on Maintenance:</strong>
        <p style="margin: 10px 0 0;">Pay with TYT tokens and get automatic 20% discount + burn benefit!</p>
      </div>
    </div>

    <div class="footer">
      <p><strong>TakeYourToken</strong></p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">
        © 2024 TakeYourToken. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  },

  kycStatusUpdate: {
    subject: 'KYC Verification Update - {{status}}',
    getHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 30px 20px; text-align: center; color: white; }
    .content { padding: 40px 30px; }
    .tier-box { background: #ecfeff; border: 2px solid #06b6d4; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎯 KYC Status Update</h1>
    </div>

    <div class="content">
      <h2>Verification ${data.status === 'approved' ? 'Approved! ✅' : 'Update'}</h2>

      ${data.status === 'approved' ? `
      <div class="tier-box">
        <h3 style="margin-top: 0;">🎉 Congratulations!</h3>
        <p>Your KYC verification has been approved. You are now at <strong>Tier ${data.tier}</strong>!</p>

        <h4>Your New Limits:</h4>
        <ul>
          <li><strong>Daily:</strong> $${data.dailyLimit || '0'}</li>
          <li><strong>Weekly:</strong> $${data.weeklyLimit || '0'}</li>
          <li><strong>Monthly:</strong> $${data.monthlyLimit || 'Unlimited'}</li>
        </ul>
      </div>
      ` : `
      <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0;">⚠️ Additional Information Needed</h3>
        <p>${data.reason || 'Please review your submitted documents and resubmit.'}</p>
      </div>
      `}

      <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>💡 Need Help?</strong>
        <p style="margin: 10px 0 0;">Contact our support team at kyc@takeyourtoken.app</p>
      </div>
    </div>

    <div class="footer">
      <p><strong>TakeYourToken</strong></p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">
        © 2024 TakeYourToken. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  },

  securityAlert: {
    subject: '🔒 Security Alert - {{event}}',
    getHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px 20px; text-align: center; color: white; }
    .content { padding: 40px 30px; }
    .alert-box { background: #fef2f2; border: 3px solid #dc2626; border-radius: 8px; padding: 25px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🔒 Security Alert</h1>
      <p style="margin: 10px 0 0; opacity: 0.9; font-size: 18px;">Immediate Attention Required</p>
    </div>

    <div class="content">
      <div class="alert-box">
        <h2 style="color: #dc2626; margin-top: 0;">⚠️ ${data.event || 'Security Event Detected'}</h2>
        <p><strong>Event:</strong> ${data.description || 'Suspicious activity detected on your account'}</p>
        <p><strong>Time:</strong> ${data.timestamp || new Date().toISOString()}</p>
        <p><strong>Location:</strong> ${data.location || 'Unknown'}</p>
        <p><strong>Device:</strong> ${data.device || 'Unknown'}</p>
      </div>

      <h3>🛡️ Immediate Actions:</h3>
      <ol>
        <li><strong>Change your password</strong> immediately if you don't recognize this activity</li>
        <li><strong>Review recent transactions</strong> in your account</li>
        <li><strong>Enable 2FA</strong> for additional security</li>
        <li><strong>Contact support</strong> if you need assistance</li>
      </ol>

      <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>❓ Was This You?</strong>
        <p style="margin: 10px 0 0;">If you recognize this activity, you can safely ignore this email. We're just being extra cautious with your security.</p>
      </div>

      <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>📞 Emergency Contact:</strong>
        <p style="margin: 10px 0 0;">
          Email: security@takeyourtoken.app<br>
          Response Time: Within 1 hour
        </p>
      </div>
    </div>

    <div class="footer">
      <p><strong>TakeYourToken Security Team</strong></p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">
        © 2024 TakeYourToken. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  },

  foundationReceipt: {
    subject: 'Thank You for Supporting Child Brain Cancer Research',
    getHtml: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); padding: 40px 20px; text-align: center; color: white; }
    .content { padding: 40px 30px; }
    .donation-box { background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 2px solid #ec4899; border-radius: 8px; padding: 25px; margin: 20px 0; text-align: center; }
    .amount { font-size: 36px; font-weight: bold; color: #ec4899; margin: 15px 0; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">❤️ Thank You!</h1>
      <p style="margin: 10px 0 0; opacity: 0.9; font-size: 18px;">You're Making a Difference</p>
    </div>

    <div class="content">
      <p>Dear ${data.donorName || 'Supporter'},</p>

      <p>Thank you for your contribution to the <strong>TYT Children's Brain Cancer Research & Support Foundation</strong>. Your generosity directly supports life-saving research and helps families facing pediatric brain tumors.</p>

      <div class="donation-box">
        <p style="margin: 0; color: #666;">Your Contribution</p>
        <div class="amount">${data.amount} ${data.asset || 'USD'}</div>
        <p style="margin: 0; color: #666;">Transaction ID: ${data.txId || 'PENDING'}</p>
      </div>

      <h3>🎯 Your Impact:</h3>
      <ul>
        <li>Supporting cutting-edge brain tumor research</li>
        <li>Helping families with medical expenses</li>
        <li>Funding advanced diagnostic equipment</li>
        <li>Enabling clinical trials for new treatments</li>
      </ul>

      <div style="background: #f0fdf4; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #10b981;">✨ Foundation Impact So Far:</h4>
        <p><strong>Total Raised:</strong> $${data.totalRaised || '0'}</p>
        <p><strong>Families Supported:</strong> ${data.familiesHelped || '0'}</p>
        <p><strong>Research Grants:</strong> ${data.grantsIssued || '0'}</p>
      </div>

      <div style="background: #fffbeb; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>🧾 Tax Receipt:</strong>
        <p style="margin: 10px 0 0;">This email serves as your donation receipt. TYT Children's Brain Cancer Foundation is a registered 501(c)(3) organization. Tax ID: ${data.taxId || 'Pending'}</p>
      </div>

      <p style="text-align: center; margin: 30px 0;">
        <strong>Together, we're fighting for children's futures.</strong><br>
        Thank you for being part of our mission.
      </p>
    </div>

    <div class="footer">
      <p><strong>TYT Children's Brain Cancer Research & Support Foundation</strong></p>
      <p style="margin: 10px 0;">
        📧 foundation@takeyourtoken.app<br>
        🌐 takeyourtoken.app/foundation
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        © 2024 TYT Foundation. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  },
};

function renderTemplate(template: string, data: Record<string, any>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  return result;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY not configured');
    }

    const { to, template, data }: EmailRequest = await req.json();

    if (!to || !template) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, template' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailTemplate = templates[template];
    if (!emailTemplate) {
      return new Response(
        JSON.stringify({ error: `Unknown template: ${template}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const subject = renderTemplate(emailTemplate.subject, data);
    const html = emailTemplate.getHtml(data);

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: subject,
          },
        ],
        from: {
          email: FROM_EMAIL,
          name: FROM_NAME,
        },
        content: [
          {
            type: 'text/html',
            value: html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('SendGrid error:', error);
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        template,
        to
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to send email',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
