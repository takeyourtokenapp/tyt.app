import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EmailPayload {
  to: string;
  subject: string;
  template: 'welcome' | 'kyc_approved' | 'kyc_rejected' | 'withdrawal_approved' | 'miner_minted' | 'reward_claimed' | 'custom';
  data?: Record<string, any>;
  customHtml?: string;
}

const EMAIL_TEMPLATES = {
  welcome: (data: any) => ({
    subject: 'Welcome to TakeYourToken!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D2A44C 0%, #F4D03F 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .button { display: inline-block; padding: 12px 30px; background: #D2A44C; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to TakeYourToken!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.username || 'there'},</p>
              <p>Thank you for joining TakeYourToken, the first Web3 mining platform funding pediatric brain cancer research!</p>
              <p>Your account has been created successfully. Here's what you can do next:</p>
              <ul>
                <li>Complete KYC verification to unlock full features</li>
                <li>Explore the Academy to learn about mining and blockchain</li>
                <li>Mint your first NFT Miner to start earning rewards</li>
                <li>Support the TYT Children's Brain Cancer Foundation</li>
              </ul>
              <a href="https://takeyourtoken.app/app/dashboard" class="button">Go to Dashboard</a>
              <p>If you have any questions, our support team is here to help!</p>
              <p>Best regards,<br>The TakeYourToken Team</p>
            </div>
            <div class="footer">
              <p>© 2026 TakeYourToken. All rights reserved.</p>
              <p>You're receiving this email because you registered on takeyourtoken.app</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  kyc_approved: (data: any) => ({
    subject: 'KYC Verification Approved',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .button { display: inline-block; padding: 12px 30px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ KYC Approved!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.username},</p>
              <p>Great news! Your KYC verification has been approved.</p>
              <p>You now have full access to all platform features:</p>
              <ul>
                <li>Mint NFT Miners</li>
                <li>Trade on Marketplace</li>
                <li>Withdraw funds</li>
                <li>Full wallet functionality</li>
              </ul>
              <a href="https://takeyourtoken.app/app/miners" class="button">Start Mining Now</a>
              <p>Thank you for completing the verification process!</p>
              <p>Best regards,<br>The TakeYourToken Team</p>
            </div>
            <div class="footer">
              <p>© 2026 TakeYourToken. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  kyc_rejected: (data: any) => ({
    subject: 'KYC Verification Update',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .button { display: inline-block; padding: 12px 30px; background: #EF4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>KYC Verification Update</h1>
            </div>
            <div class="content">
              <p>Hi ${data.username},</p>
              <p>Unfortunately, we were unable to verify your identity at this time.</p>
              <p><strong>Reason:</strong> ${data.reason || 'Document quality or information mismatch'}</p>
              <p>Don't worry! You can resubmit your verification with:</p>
              <ul>
                <li>Clear, high-quality photos of your documents</li>
                <li>Ensure all information is clearly visible</li>
                <li>Make sure document is not expired</li>
                <li>Provide current address proof if required</li>
              </ul>
              <a href="https://takeyourtoken.app/app/kyc" class="button">Resubmit KYC</a>
              <p>If you need assistance, please contact our support team.</p>
              <p>Best regards,<br>The TakeYourToken Team</p>
            </div>
            <div class="footer">
              <p>© 2026 TakeYourToken. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  withdrawal_approved: (data: any) => ({
    subject: `Withdrawal Approved - ${data.amount} ${data.currency}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .button { display: inline-block; padding: 12px 30px; background: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
            .details { background: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Withdrawal Approved</h1>
            </div>
            <div class="content">
              <p>Hi ${data.username},</p>
              <p>Your withdrawal request has been approved and is being processed.</p>
              <div class="details">
                <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
                <p><strong>Destination:</strong> ${data.address}</p>
                <p><strong>Transaction ID:</strong> ${data.txId || 'Processing...'}</p>
              </div>
              <p>Your funds should arrive within ${data.estimatedTime || '24 hours'}.</p>
              <a href="https://takeyourtoken.app/app/transactions" class="button">View Transaction</a>
              <p>If you did not initiate this withdrawal, please contact support immediately.</p>
              <p>Best regards,<br>The TakeYourToken Team</p>
            </div>
            <div class="footer">
              <p>© 2026 TakeYourToken. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  miner_minted: (data: any) => ({
    subject: `Congratulations! NFT Miner #${data.minerId} Minted`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .button { display: inline-block; padding: 12px 30px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
            .miner-stats { background: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 NFT Miner Minted!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.username},</p>
              <p>Congratulations! Your NFT Miner has been successfully minted.</p>
              <div class="miner-stats">
                <p><strong>Miner ID:</strong> #${data.minerId}</p>
                <p><strong>Hashrate:</strong> ${data.hashrate} TH/s</p>
                <p><strong>Efficiency:</strong> ${data.efficiency} W/TH</p>
                <p><strong>Region:</strong> ${data.region}</p>
              </div>
              <p>Your miner will start generating rewards immediately. Daily rewards will be calculated and available for claim.</p>
              <a href="https://takeyourtoken.app/app/miners/${data.minerId}" class="button">View Your Miner</a>
              <p>Remember to pay maintenance fees regularly to keep your miner active!</p>
              <p>Best regards,<br>The TakeYourToken Team</p>
            </div>
            <div class="footer">
              <p>© 2026 TakeYourToken. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  reward_claimed: (data: any) => ({
    subject: `Rewards Claimed - ${data.amount} BTC`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .button { display: inline-block; padding: 12px 30px; background: #F59E0B; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Rewards Claimed!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.username},</p>
              <p>You've successfully claimed your mining rewards!</p>
              <p><strong>Amount Claimed:</strong> ${data.amount} BTC</p>
              <p>The rewards have been added to your wallet balance. You can now:</p>
              <ul>
                <li>Withdraw to external wallet</li>
                <li>Reinvest in more miners</li>
                <li>Trade on marketplace</li>
                <li>Donate to the Foundation</li>
              </ul>
              <a href="https://takeyourtoken.app/app/wallet" class="button">View Wallet</a>
              <p>Keep mining to earn more rewards!</p>
              <p>Best regards,<br>The TakeYourToken Team</p>
            </div>
            <div class="footer">
              <p>© 2026 TakeYourToken. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: EmailPayload = await req.json();

    if (!payload.to || !payload.template) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, template' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let emailContent;

    if (payload.template === 'custom' && payload.customHtml) {
      emailContent = {
        subject: payload.subject,
        html: payload.customHtml,
      };
    } else {
      const templateFn = EMAIL_TEMPLATES[payload.template];
      if (!templateFn) {
        return new Response(
          JSON.stringify({ error: `Unknown template: ${payload.template}` }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      emailContent = templateFn(payload.data || {});
    }

    console.log(`Sending email to ${payload.to} with template ${payload.template}`);
    console.log(`Subject: ${emailContent.subject}`);

    const response = {
      success: true,
      message: 'Email sent successfully',
      to: payload.to,
      subject: emailContent.subject,
      template: payload.template,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending email:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
