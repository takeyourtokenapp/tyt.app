import { Shield, FileText, AlertCircle, Scale, Lock, Users } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 mb-6">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-lg">Last Updated: December 12, 2024</p>
          <p className="text-gray-500 mt-2">Effective Date: January 1, 2025</p>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-400 mb-2">Please Read Carefully</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and TakeYourToken ("TYT", "we", "us", or "our").
                By accessing or using our platform, you agree to be bound by these Terms. If you do not agree, do not use our services.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* 1. Definitions */}
          <Section
            icon={FileText}
            title="1. Definitions"
            content={
              <>
                <p><strong>"Platform"</strong> refers to the TakeYourToken web application, mobile applications, and all related services.</p>
                <p><strong>"Digital Miner" or "NFT Miner"</strong> refers to non-fungible tokens that represent mining capacity and associated benefits.</p>
                <p><strong>"TYT Token"</strong> refers to our utility token used for platform operations and governance.</p>
                <p><strong>"Mining Rewards"</strong> refers to Bitcoin (BTC) distributions generated from mining operations.</p>
                <p><strong>"User"</strong> refers to any individual or entity that accesses or uses the Platform.</p>
                <p><strong>"Foundation"</strong> refers to the TYT Children's Brain Cancer Research & Support Foundation.</p>
              </>
            }
          />

          {/* 2. Eligibility */}
          <Section
            icon={Users}
            title="2. Eligibility and Account Registration"
            content={
              <>
                <h4 className="font-semibold text-amber-400 mb-2">2.1 Age Requirement</h4>
                <p>You must be at least 18 years old to use our Platform. By registering, you represent and warrant that you meet this requirement.</p>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">2.2 Jurisdictional Restrictions</h4>
                <p>Our services are not available to residents of:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>United States (pending regulatory clarity)</li>
                  <li>Countries subject to international sanctions</li>
                  <li>Jurisdictions where our services are prohibited</li>
                </ul>
                <p className="mt-2">It is your responsibility to ensure compliance with local laws.</p>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">2.3 Account Security</h4>
                <p>You are responsible for:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                  <li>Using strong passwords and enabling two-factor authentication</li>
                </ul>
              </>
            }
          />

          {/* 3. Platform Services */}
          <Section
            icon={Shield}
            title="3. Platform Services"
            content={
              <>
                <h4 className="font-semibold text-amber-400 mb-2">3.1 Digital Miners (NFTs)</h4>
                <p>Digital Miners are non-fungible tokens that provide:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Access to mining rewards based on hashrate capacity</li>
                  <li>Ability to trade on our marketplace</li>
                  <li>Participation in platform governance (future)</li>
                  <li>VIP benefits based on ownership tier</li>
                </ul>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">3.2 Mining Rewards Distribution</h4>
                <p>Mining rewards are:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Calculated daily based on Bitcoin network conditions</li>
                  <li>Subject to electricity costs and maintenance fees</li>
                  <li>Distributed after deducting platform service fees (15%)</li>
                  <li>Not guaranteed and may vary based on market conditions</li>
                </ul>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">3.3 Maintenance Fees</h4>
                <p>Users must pay daily maintenance fees covering:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Electricity consumption</li>
                  <li>Data center operations</li>
                  <li>Equipment maintenance</li>
                  <li>Platform operations</li>
                </ul>
                <p className="mt-2">Fees can be paid in TYT tokens (with 20% discount), USDT, or BTC.</p>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">3.4 Marketplace</h4>
                <p>Our marketplace allows:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Buying and selling Digital Miners between users</li>
                  <li>Setting custom prices and accepting offers</li>
                  <li>All transactions occur in TYT tokens</li>
                  <li>Platform fee: 5% (2% to seller, 2% to buyer, 1% to Foundation)</li>
                </ul>
              </>
            }
          />

          {/* 4. Financial Terms */}
          <Section
            icon={Lock}
            title="4. Financial Terms and Risks"
            content={
              <>
                <h4 className="font-semibold text-amber-400 mb-2">4.1 No Investment Advice</h4>
                <p className="font-semibold text-red-400">
                  TYT DOES NOT PROVIDE INVESTMENT, FINANCIAL, OR LEGAL ADVICE.
                </p>
                <p className="mt-2">
                  Our Platform provides access to mining services. You should consult with qualified professionals
                  before making any financial decisions.
                </p>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">4.2 No Guaranteed Returns</h4>
                <p>Mining rewards are:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Variable and dependent on Bitcoin network difficulty</li>
                  <li>Affected by Bitcoin price volatility</li>
                  <li>Subject to operational costs and fees</li>
                  <li>NOT guaranteed and may result in losses</li>
                </ul>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">4.3 Risk Disclosure</h4>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-2">
                  <p className="font-semibold text-red-400 mb-2">HIGH RISK WARNING</p>
                  <p>Cryptocurrency mining involves substantial risks including but not limited to:</p>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Total loss of invested capital</li>
                    <li>Bitcoin price volatility (can drop 50%+ rapidly)</li>
                    <li>Network difficulty increases reducing profitability</li>
                    <li>Regulatory changes affecting operations</li>
                    <li>Technical failures and operational issues</li>
                    <li>Smart contract vulnerabilities</li>
                  </ul>
                  <p className="mt-3 font-semibold">ONLY INVEST WHAT YOU CAN AFFORD TO LOSE.</p>
                </div>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">4.4 Taxation</h4>
                <p>
                  You are solely responsible for determining applicable taxes and reporting requirements in your jurisdiction.
                  Mining rewards and token transactions may be taxable events.
                </p>
              </>
            }
          />

          {/* 5. KYC and Compliance */}
          <Section
            icon={Shield}
            title="5. KYC and Compliance"
            content={
              <>
                <h4 className="font-semibold text-amber-400 mb-2">5.1 Identity Verification</h4>
                <p>We implement a three-tier KYC system:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Tier 1</strong>: Basic information (up to $1,000/day withdrawals)</li>
                  <li><strong>Tier 2</strong>: Government ID and selfie (up to $10,000/day)</li>
                  <li><strong>Tier 3</strong>: Enhanced due diligence (up to $50,000/day)</li>
                </ul>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">5.2 AML/CTF Compliance</h4>
                <p>We reserve the right to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Request additional documentation at any time</li>
                  <li>Freeze or terminate accounts suspected of illegal activity</li>
                  <li>Report suspicious transactions to authorities</li>
                  <li>Refuse service without explanation</li>
                </ul>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">5.3 Withdrawal Limits</h4>
                <p>Withdrawal limits are enforced based on your KYC tier and may be:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Reduced or suspended during investigations</li>
                  <li>Subject to additional verification requirements</li>
                  <li>Delayed for large transactions (manual review)</li>
                </ul>
              </>
            }
          />

          {/* 6. Prohibited Activities */}
          <Section
            icon={AlertCircle}
            title="6. Prohibited Activities"
            content={
              <>
                <p>You agree NOT to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  <li>Use the Platform for any illegal purposes</li>
                  <li>Engage in market manipulation or wash trading</li>
                  <li>Create multiple accounts to circumvent limits</li>
                  <li>Use automated tools without authorization</li>
                  <li>Reverse engineer or attempt to access our systems</li>
                  <li>Interfere with other users' experience</li>
                  <li>Impersonate others or provide false information</li>
                  <li>Use the Platform to launder money or finance terrorism</li>
                  <li>Transfer or sell your account</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
                <p className="mt-3 font-semibold text-red-400">
                  Violation may result in immediate account termination and legal action.
                </p>
              </>
            }
          />

          {/* 7. Intellectual Property */}
          <Section
            icon={FileText}
            title="7. Intellectual Property"
            content={
              <>
                <p>All Platform content, including but not limited to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Owl Warrior design system and branding</li>
                  <li>Website code and architecture</li>
                  <li>Smart contracts and algorithms</li>
                  <li>Text, graphics, logos, and images</li>
                </ul>
                <p className="mt-2">
                  ...are owned by TYT or our licensors and protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="mt-2">
                  You are granted a limited, non-exclusive, non-transferable license to access and use the Platform for personal use only.
                </p>
              </>
            }
          />

          {/* 8. Disclaimers */}
          <Section
            icon={AlertCircle}
            title="8. Disclaimers and Limitations of Liability"
            content={
              <>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">8.1 "AS IS" Service</h4>
                  <p>
                    THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND,
                    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                    PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                  </p>
                </div>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">8.2 No Guarantee of Availability</h4>
                <p>We do not guarantee that the Platform will:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Be available at all times or free from interruptions</li>
                  <li>Be error-free or secure</li>
                  <li>Meet your specific requirements</li>
                  <li>Produce specific results or returns</li>
                </ul>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">8.3 Limitation of Liability</h4>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-2">
                  <p className="font-semibold mb-2">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, TYT SHALL NOT BE LIABLE FOR:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Any indirect, incidental, special, or consequential damages</li>
                    <li>Loss of profits, revenue, or data</li>
                    <li>Business interruption</li>
                    <li>Losses resulting from market volatility</li>
                    <li>Smart contract vulnerabilities or exploits</li>
                    <li>Third-party actions or failures</li>
                  </ul>
                  <p className="mt-3 font-semibold">
                    OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS
                    PRECEDING THE CLAIM.
                  </p>
                </div>
              </>
            }
          />

          {/* 9. Termination */}
          <Section
            icon={Lock}
            title="9. Termination"
            content={
              <>
                <h4 className="font-semibold text-amber-400 mb-2">9.1 By You</h4>
                <p>You may terminate your account at any time by:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Withdrawing all balances</li>
                  <li>Selling all Digital Miners</li>
                  <li>Contacting support to close your account</li>
                </ul>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">9.2 By Us</h4>
                <p>We may suspend or terminate your account:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>For violation of these Terms</li>
                  <li>For suspected illegal activity</li>
                  <li>For failure to complete KYC verification</li>
                  <li>At our discretion with or without notice</li>
                </ul>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">9.3 Effect of Termination</h4>
                <p>Upon termination:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>You must withdraw all funds within 30 days</li>
                  <li>Unclaimed funds may be subject to escheatment laws</li>
                  <li>You lose access to all Platform services</li>
                  <li>Provisions that should survive termination will remain in effect</li>
                </ul>
              </>
            }
          />

          {/* 10. Dispute Resolution */}
          <Section
            icon={Scale}
            title="10. Dispute Resolution and Governing Law"
            content={
              <>
                <h4 className="font-semibold text-amber-400 mb-2">10.1 Governing Law</h4>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of [JURISDICTION TBD],
                  without regard to its conflict of law provisions.
                </p>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">10.2 Arbitration</h4>
                <p>
                  Any dispute arising from these Terms shall be resolved through binding arbitration in accordance with
                  [ARBITRATION RULES TBD]. You waive your right to participate in class action lawsuits.
                </p>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">10.3 Exceptions</h4>
                <p>The arbitration requirement does not apply to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Claims for intellectual property infringement</li>
                  <li>Small claims court proceedings</li>
                  <li>Injunctive or equitable relief</li>
                </ul>
              </>
            }
          />

          {/* 11. Changes to Terms */}
          <Section
            icon={FileText}
            title="11. Changes to These Terms"
            content={
              <>
                <p>We reserve the right to modify these Terms at any time. Changes will be effective:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Immediately upon posting for non-material changes</li>
                  <li>30 days after notification for material changes</li>
                </ul>
                <p className="mt-2">
                  Your continued use of the Platform after changes constitutes acceptance of the modified Terms.
                </p>
              </>
            }
          />

          {/* 12. Foundation Contribution */}
          <Section
            icon={Users}
            title="12. Children's Brain Cancer Foundation"
            content={
              <>
                <p>
                  A portion of all Platform revenue (approximately 1-2%) is automatically contributed to the
                  TYT Children's Brain Cancer Research & Support Foundation.
                </p>
                <p className="mt-2">By using our Platform, you acknowledge and support this charitable mission.</p>
                <p className="mt-2 font-semibold text-amber-400">
                  Foundation contributions are NOT tax-deductible donations from users but rather corporate allocations.
                </p>
                <p className="mt-2">
                  For transparency, all Foundation transactions are recorded on-chain and publicly auditable.
                </p>
              </>
            }
          />

          {/* 13. Miscellaneous */}
          <Section
            icon={FileText}
            title="13. Miscellaneous"
            content={
              <>
                <h4 className="font-semibold text-amber-400 mb-2">13.1 Entire Agreement</h4>
                <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and TYT.</p>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">13.2 Severability</h4>
                <p>If any provision is found unenforceable, the remaining provisions remain in full effect.</p>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">13.3 Waiver</h4>
                <p>Failure to enforce any provision does not constitute a waiver of that provision.</p>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">13.4 Assignment</h4>
                <p>You may not assign these Terms. We may assign our rights without restriction.</p>

                <h4 className="font-semibold text-amber-400 mb-2 mt-4">13.5 Force Majeure</h4>
                <p>
                  We are not liable for failures caused by events beyond our reasonable control, including natural disasters,
                  war, pandemics, or government actions.
                </p>
              </>
            }
          />

          {/* Contact */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 mt-12">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="space-y-2 text-gray-400">
              <p><strong className="text-amber-400">Email:</strong> legal@takeyourtoken.app</p>
              <p><strong className="text-amber-400">Support:</strong> support@takeyourtoken.app</p>
              <p><strong className="text-amber-400">Address:</strong> [Legal Entity Address TBD]</p>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6 mt-8">
            <p className="text-center">
              <strong>By using TakeYourToken, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, content }: { icon: any; title: string; content: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/50">
          <Icon className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <div className="text-gray-300 space-y-3 leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
