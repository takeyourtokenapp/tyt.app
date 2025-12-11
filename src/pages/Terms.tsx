import { ArrowLeft, Shield, FileText, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-amber-400" />
              <span className="font-bold text-lg">Legal Terms</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/50">
              <FileText className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
              <p className="text-gray-400">Last Updated: December 11, 2024</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-amber-400 mb-2">Important Notice</h3>
                  <p className="text-gray-300 text-sm">
                    Please read these Terms of Service carefully before using the TakeYourToken platform.
                    By accessing or using our services, you agree to be bound by these terms.
                  </p>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">1. Service Description</h2>
              <p className="text-gray-300 mb-4">
                TakeYourToken ("TYT", "we", "us", or "our") operates a Web3 platform that provides:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>NFT-based digital mining services</li>
                <li>Cryptocurrency wallet services (custodial)</li>
                <li>Digital asset marketplace</li>
                <li>Educational resources (TYT Academy)</li>
                <li>Charitable foundation support</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Our services are provided "as is" and are subject to availability. We reserve the right to modify,
                suspend, or discontinue any part of our services at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">2. Eligibility and Account Registration</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">2.1 Age Requirements</h3>
              <p className="text-gray-300 mb-4">
                You must be at least 18 years old (or the age of majority in your jurisdiction) to use our services.
                By registering, you represent and warrant that you meet this requirement.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">2.2 Geographic Restrictions</h3>
              <p className="text-gray-300 mb-4">
                Our services are not available to residents of certain jurisdictions, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>United States (pending regulatory approval)</li>
                <li>Sanctioned countries (Iran, North Korea, Syria, Cuba, etc.)</li>
                <li>Jurisdictions where cryptocurrency services are prohibited</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">2.3 Account Security</h3>
              <p className="text-gray-300 mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Using strong passwords and enabling two-factor authentication</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">3. KYC and AML Compliance</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">3.1 Identity Verification</h3>
              <p className="text-gray-300 mb-4">
                We implement Know Your Customer (KYC) procedures in compliance with applicable regulations.
                You may be required to provide:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Government-issued photo identification</li>
                <li>Proof of address</li>
                <li>Selfie verification</li>
                <li>Additional documentation as requested</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">3.2 Withdrawal Limits</h3>
              <p className="text-gray-300 mb-4">
                KYC verification determines your withdrawal limits:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Tier 1:</strong> $1,000 daily / $5,000 weekly / $20,000 monthly</li>
                <li><strong>Tier 2:</strong> $10,000 daily / $50,000 weekly / $200,000 monthly</li>
                <li><strong>Tier 3:</strong> $50,000 daily / $250,000 weekly / Unlimited monthly</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">3.3 Anti-Money Laundering</h3>
              <p className="text-gray-300 mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Monitor and investigate suspicious transactions</li>
                <li>Freeze accounts pending investigation</li>
                <li>Report suspicious activity to authorities</li>
                <li>Request source of funds documentation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">4. NFT Digital Miners</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">4.1 Nature of Digital Miners</h3>
              <p className="text-gray-300 mb-4">
                NFT Digital Miners represent access rights to our mining services. They are NOT:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Securities or investment contracts</li>
                <li>Ownership of physical mining hardware</li>
                <li>Guaranteed profit-generating assets</li>
                <li>Subject to any profit-sharing agreements</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">4.2 Rewards Structure</h3>
              <p className="text-gray-300 mb-4">
                Daily BTC rewards are calculated based on:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>NFT hashrate (TH/s)</li>
                <li>Current Bitcoin network difficulty</li>
                <li>Electricity costs (variable)</li>
                <li>15% service fee</li>
                <li>Applicable discounts (VIP, service button)</li>
              </ul>
              <p className="text-gray-300 mb-4 text-sm italic">
                Rewards are NOT guaranteed and may fluctuate based on network conditions,
                electricity costs, and Bitcoin price volatility.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">4.3 Maintenance Fees</h3>
              <p className="text-gray-300 mb-4">
                You are responsible for monthly maintenance fees covering:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Electricity consumption</li>
                <li>Cooling and facility costs</li>
                <li>Hardware maintenance</li>
                <li>Technical support</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Failure to pay maintenance fees may result in temporary suspension or permanent deactivation of your NFT miner.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">5. Financial Terms</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">5.1 Fees</h3>
              <p className="text-gray-300 mb-4">
                We charge the following fees:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li><strong>Deposit:</strong> Network fees only (paid to blockchain)</li>
                <li><strong>Withdrawal:</strong> 1% platform fee + network fees</li>
                <li><strong>Marketplace:</strong> 5% seller fee, 1% to TYT Foundation</li>
                <li><strong>Mining Service:</strong> 15% of gross BTC rewards</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">5.2 Payment Processing</h3>
              <p className="text-gray-300 mb-4">
                All payments are processed in cryptocurrency. We do not accept fiat currency.
                You are responsible for ensuring sufficient funds for transactions and fees.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">5.3 Refund Policy</h3>
              <p className="text-gray-300 mb-4">
                Due to the nature of blockchain transactions and digital assets:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>NFT purchases are final and non-refundable</li>
                <li>Maintenance fee payments are non-refundable</li>
                <li>Marketplace transactions cannot be reversed</li>
                <li>We may offer refunds at our sole discretion in exceptional cases</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">6. Wallet Services</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">6.1 Custodial Wallet</h3>
              <p className="text-gray-300 mb-4">
                We provide custodial wallet services, meaning we hold the private keys to your assets.
                You acknowledge and accept the risks associated with custodial services.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">6.2 Asset Security</h3>
              <p className="text-gray-300 mb-4">
                While we implement industry-standard security measures, we cannot guarantee absolute security.
                You understand that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Digital assets may be lost due to hacks, technical failures, or regulatory action</li>
                <li>We are not liable for losses beyond our direct control</li>
                <li>Insurance coverage may be limited or unavailable</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">6.3 Withdrawal Delays</h3>
              <p className="text-gray-300 mb-4">
                Withdrawal requests may be delayed or rejected if:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>KYC verification is incomplete</li>
                <li>Suspicious activity is detected</li>
                <li>Withdrawal limits are exceeded</li>
                <li>Regulatory compliance requires additional review</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">7. Marketplace Terms</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">7.1 Listing Requirements</h3>
              <p className="text-gray-300 mb-4">
                When listing NFTs for sale:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>You must own the NFT you are listing</li>
                <li>Pricing must be in TYT tokens only</li>
                <li>You agree to pay the 5% seller fee</li>
                <li>Listings may be removed for policy violations</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">7.2 Transaction Finality</h3>
              <p className="text-gray-300 mb-4">
                Marketplace transactions are final upon completion. Buyers should verify NFT details before purchase.
                We are not responsible for buyer's remorse or misunderstood listings.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">7.3 Dispute Resolution</h3>
              <p className="text-gray-300 mb-4">
                In case of disputes, we may mediate but are not obligated to refund or reverse transactions.
                Our decision is final and binding.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">8. Prohibited Activities</h2>
              <p className="text-gray-300 mb-4">
                You agree NOT to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Use the platform for money laundering, terrorist financing, or illegal activities</li>
                <li>Create multiple accounts to circumvent limits or policies</li>
                <li>Manipulate markets or engage in wash trading</li>
                <li>Reverse engineer, hack, or exploit platform vulnerabilities</li>
                <li>Impersonate others or provide false information</li>
                <li>Use bots or automated systems without permission</li>
                <li>Spam, harass, or abuse other users or staff</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Violation of these terms may result in account suspension, asset freezing, and legal action.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">9. Disclaimers and Limitations of Liability</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">9.1 No Investment Advice</h3>
              <p className="text-gray-300 mb-4">
                Nothing on this platform constitutes financial, investment, legal, or tax advice.
                You should consult professionals before making financial decisions.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">9.2 No Guarantees</h3>
              <p className="text-gray-300 mb-4">
                We make no guarantees regarding:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Profitability of mining operations</li>
                <li>Future value of TYT tokens or NFTs</li>
                <li>Uninterrupted platform availability</li>
                <li>Accuracy of calculations or data</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">9.3 Limitation of Liability</h3>
              <p className="text-gray-300 mb-4">
                To the maximum extent permitted by law, TakeYourToken and its officers, directors, employees,
                and affiliates shall not be liable for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Loss of profits, revenue, or business opportunities</li>
                <li>Loss of digital assets due to market volatility</li>
                <li>Indirect, incidental, or consequential damages</li>
                <li>Losses exceeding the fees you paid in the prior 12 months</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">10. Intellectual Property</h2>
              <p className="text-gray-300 mb-4">
                All content, trademarks, logos, and intellectual property on this platform are owned by
                TakeYourToken or licensed to us. You may not use our intellectual property without written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">11. Termination</h2>
              <p className="text-gray-300 mb-4">
                We reserve the right to suspend or terminate your account at any time for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Violation of these Terms</li>
                <li>Suspected fraudulent or illegal activity</li>
                <li>Regulatory or legal requirements</li>
                <li>Extended inactivity</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Upon termination, you may withdraw your assets subject to applicable limits and compliance requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">12. Governing Law and Dispute Resolution</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">12.1 Governing Law</h3>
              <p className="text-gray-300 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction TBD],
                without regard to conflict of law principles.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">12.2 Arbitration</h3>
              <p className="text-gray-300 mb-4">
                Any disputes arising from these Terms or your use of our services shall be resolved through
                binding arbitration, except where prohibited by law.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">12.3 Class Action Waiver</h3>
              <p className="text-gray-300 mb-4">
                You agree to resolve disputes on an individual basis and waive any right to participate in
                class action lawsuits.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">13. Changes to Terms</h2>
              <p className="text-gray-300 mb-4">
                We may modify these Terms at any time. Changes will be effective upon posting to the platform.
                Continued use of our services constitutes acceptance of the updated Terms.
              </p>
              <p className="text-gray-300">
                We will notify users of material changes via email or platform notification.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">14. Contact Information</h2>
              <p className="text-gray-300 mb-4">
                For questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-300 mb-2"><strong>Email:</strong> legal@takeyourtoken.app</p>
                <p className="text-gray-300 mb-2"><strong>Support:</strong> support@takeyourtoken.app</p>
                <p className="text-gray-300"><strong>Address:</strong> [To Be Determined]</p>
              </div>
            </section>

            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6 mt-8">
              <p className="text-gray-300 text-sm">
                <strong>Acknowledgment:</strong> By clicking "I Agree" during registration or by using our services,
                you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-500 text-center text-sm">
                Last Updated: December 11, 2024 • Version 1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
