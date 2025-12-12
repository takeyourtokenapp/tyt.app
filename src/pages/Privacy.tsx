import { Shield, Lock, Eye } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/50">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-gray-400">Last Updated: December 11, 2024</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <Eye className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">Your Privacy Matters</h3>
                  <p className="text-gray-300 text-sm">
                    TakeYourToken is committed to protecting your privacy and personal data.
                    This policy explains how we collect, use, and safeguard your information.
                  </p>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">1. Information We Collect</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">1.1 Information You Provide</h3>
              <p className="text-gray-300 mb-4">
                When you register and use our services, we collect:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li><strong>Account Information:</strong> Email address, username, password (encrypted)</li>
                <li><strong>KYC Information:</strong> Full name, date of birth, address, government ID, selfie photo</li>
                <li><strong>Financial Information:</strong> Cryptocurrency wallet addresses, transaction history</li>
                <li><strong>Communication:</strong> Support tickets, emails, chat messages</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">1.2 Information Collected Automatically</h3>
              <p className="text-gray-300 mb-4">
                When you use our platform, we automatically collect:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                <li><strong>Cookies:</strong> Session tokens, preferences, analytics data</li>
                <li><strong>Security Logs:</strong> Login attempts, suspicious activity, API calls</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">1.3 Information from Third Parties</h3>
              <p className="text-gray-300 mb-4">
                We may receive information from:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>KYC Providers:</strong> Identity verification services</li>
                <li><strong>Blockchain Networks:</strong> Public transaction data</li>
                <li><strong>Analytics Services:</strong> Usage statistics and trends</li>
                <li><strong>Security Services:</strong> Fraud detection and prevention</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">
                We use your information to:
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">2.1 Provide Services</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Create and manage your account</li>
                <li>Process transactions and withdrawals</li>
                <li>Calculate mining rewards</li>
                <li>Provide customer support</li>
                <li>Send transaction confirmations and notifications</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">2.2 Compliance and Security</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Verify your identity (KYC/AML)</li>
                <li>Prevent fraud and unauthorized access</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Monitor for suspicious activity</li>
                <li>Respond to legal requests and law enforcement</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">2.3 Improve Our Platform</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Analyze usage patterns and trends</li>
                <li>Develop new features and services</li>
                <li>Optimize user experience</li>
                <li>Conduct research and analytics</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">2.4 Marketing (With Consent)</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Send promotional emails (you can opt-out)</li>
                <li>Announce new features and updates</li>
                <li>Share educational content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">3. How We Share Your Information</h2>
              <p className="text-gray-300 mb-4">
                We may share your information with:
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">3.1 Service Providers</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li><strong>KYC Verification:</strong> Identity verification services</li>
                <li><strong>Email Services:</strong> SendGrid for transactional emails</li>
                <li><strong>Cloud Hosting:</strong> Supabase for database and backend</li>
                <li><strong>Analytics:</strong> Usage and performance monitoring</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">3.2 Legal Requirements</h3>
              <p className="text-gray-300 mb-4">
                We may disclose information when required by:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Court orders or subpoenas</li>
                <li>Law enforcement requests</li>
                <li>Regulatory compliance obligations</li>
                <li>Protection of legal rights</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">3.3 Business Transfers</h3>
              <p className="text-gray-300 mb-4">
                In the event of a merger, acquisition, or sale of assets, your information may be
                transferred to the acquiring entity.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">3.4 What We Don't Share</h3>
              <p className="text-gray-300 mb-4">
                We NEVER:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Sell your personal information to third parties</li>
                <li>Share your data for marketing purposes without consent</li>
                <li>Disclose your private keys or passwords</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">4. Data Security</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">4.1 Security Measures</h3>
              <p className="text-gray-300 mb-4">
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li><strong>Encryption:</strong> TLS/SSL for data in transit, AES-256 for data at rest</li>
                <li><strong>Access Controls:</strong> Role-based permissions and multi-factor authentication</li>
                <li><strong>Monitoring:</strong> 24/7 security monitoring and intrusion detection</li>
                <li><strong>Audits:</strong> Regular security audits and penetration testing</li>
                <li><strong>Backup:</strong> Encrypted backups with disaster recovery procedures</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">4.2 Your Responsibilities</h3>
              <p className="text-gray-300 mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Keeping your password secure and confidential</li>
                <li>Enabling two-factor authentication</li>
                <li>Not sharing your account with others</li>
                <li>Reporting suspicious activity immediately</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">5. Your Rights (GDPR & CCPA)</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">5.1 Access and Portability</h3>
              <p className="text-gray-300 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Request a copy of your personal data</li>
                <li>Export your data in a structured format</li>
                <li>Know what data we collect and how we use it</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">5.2 Correction and Deletion</h3>
              <p className="text-gray-300 mb-4">
                You may:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Update inaccurate information</li>
                <li>Request deletion of your data (subject to legal retention requirements)</li>
                <li>Close your account (after withdrawing assets)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">5.3 Objection and Restriction</h3>
              <p className="text-gray-300 mb-4">
                You can:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Object to processing of your data for marketing</li>
                <li>Request restriction of processing in certain cases</li>
                <li>Opt-out of promotional communications</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">5.4 How to Exercise Your Rights</h3>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-300 mb-2">To exercise your rights, contact us at:</p>
                <p className="text-gray-300 mb-2"><strong>Email:</strong> privacy@takeyourtoken.app</p>
                <p className="text-gray-300 text-sm mt-4">
                  We will respond to requests within 30 days. Identity verification may be required.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">6. Cookies and Tracking</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">6.1 Types of Cookies We Use</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li><strong>Essential Cookies:</strong> Required for platform functionality (session, authentication)</li>
                <li><strong>Performance Cookies:</strong> Help us understand how users interact with the platform</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Collect data about usage patterns (anonymized)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">6.2 Managing Cookies</h3>
              <p className="text-gray-300 mb-4">
                You can control cookies through your browser settings. Note that disabling essential cookies
                may affect platform functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">7. Data Retention</h2>
              <p className="text-gray-300 mb-4">
                We retain your data for different periods depending on type:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li><strong>Account Data:</strong> Duration of account + 7 years (regulatory requirement)</li>
                <li><strong>Transaction Records:</strong> 7 years (AML/compliance)</li>
                <li><strong>KYC Documents:</strong> 7 years after account closure</li>
                <li><strong>Communications:</strong> 3 years or as legally required</li>
                <li><strong>Usage Logs:</strong> 1 year</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">8. International Data Transfers</h2>
              <p className="text-gray-300 mb-4">
                Your data may be transferred to and processed in countries outside your residence.
                We ensure appropriate safeguards are in place, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Standard contractual clauses approved by the EU Commission</li>
                <li>Compliance with GDPR and equivalent data protection laws</li>
                <li>Encryption during transfer</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">9. Children's Privacy</h2>
              <p className="text-gray-300 mb-4">
                Our services are not intended for individuals under 18 years old. We do not knowingly collect
                information from children. If we discover we have collected data from a minor, we will delete it immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">10. Changes to This Policy</h2>
              <p className="text-gray-300 mb-4">
                We may update this Privacy Policy periodically. Material changes will be communicated via:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Email notification</li>
                <li>Platform notification</li>
                <li>Update to "Last Updated" date</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Continued use after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">11. Third-Party Links</h2>
              <p className="text-gray-300 mb-4">
                Our platform may contain links to third-party websites. We are not responsible for their
                privacy practices. Please review their policies before providing any information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">12. Contact Us</h2>
              <p className="text-gray-300 mb-4">
                For privacy-related questions or concerns:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-300 mb-2"><strong>Privacy Officer:</strong> privacy@takeyourtoken.app</p>
                <p className="text-gray-300 mb-2"><strong>General Support:</strong> support@takeyourtoken.app</p>
                <p className="text-gray-300 mb-2"><strong>Data Protection:</strong> dpo@takeyourtoken.app</p>
                <p className="text-gray-300"><strong>Address:</strong> [To Be Determined]</p>
              </div>
            </section>

            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6 mt-8">
              <h3 className="font-bold text-green-400 mb-2">Our Commitment</h3>
              <p className="text-gray-300 text-sm">
                TakeYourToken is committed to transparency and protecting your privacy. We continuously
                review and improve our data protection practices to meet the highest standards.
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
