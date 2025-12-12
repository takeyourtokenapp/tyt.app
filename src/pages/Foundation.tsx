import { Heart, TrendingUp, Users, Building, FileText, ExternalLink, DollarSign, Award, Target, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Foundation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-red-500 mb-8 animate-pulse">
            <Heart className="w-12 h-12 text-white" fill="white" />
          </div>
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              TYT Children's Brain Cancer
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Research & Support Foundation
            </span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Every transaction on TakeYourToken automatically contributes to groundbreaking research
            and support for children battling brain cancer.
          </p>
          <p className="text-xl text-pink-400 mt-4 font-semibold">
            Mining crypto. Saving lives. Building hope.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/30 rounded-2xl p-10 mb-12">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center flex-shrink-0">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                The TYT Children's Brain Cancer Research & Support Foundation is dedicated to funding breakthrough
                research, supporting affected families, and ultimately finding a cure for pediatric brain tumors—one
                of the most devastating childhood diseases.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We believe that blockchain technology can revolutionize charitable giving by providing unprecedented
                transparency, automation, and global reach. Every TYT token transaction, every mining reward, every
                marketplace sale—all contribute to our mission.
              </p>
            </div>
          </div>
        </div>

        {/* Real-Time Impact Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={DollarSign}
            value="$0"
            label="Total Donated (Launch Pending)"
            color="green"
            trend="+$0 this month"
          />
          <StatCard
            icon={Users}
            value="0"
            label="Families Supported"
            color="blue"
            trend="Target: 10 Year 1"
          />
          <StatCard
            icon={Award}
            value="0"
            label="Research Grants Funded"
            color="purple"
            trend="Target: 2 Year 1"
          />
          <StatCard
            icon={TrendingUp}
            value="100%"
            label="Transparency Score"
            color="amber"
            trend="All on-chain"
          />
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-10 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">How Your Participation Helps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ContributionCard
              title="Mining Operations"
              percentage="1%"
              description="of all mining rewards automatically go to the Foundation"
              example="If you earn $100 in BTC, $1 goes to research"
            />
            <ContributionCard
              title="Marketplace Sales"
              percentage="1%"
              description="of every NFT Miner sale supports the Foundation"
              example="$500 miner sale = $5 donation"
            />
            <ContributionCard
              title="Maintenance Fees"
              percentage="1%"
              description="of daily maintenance payments fund the mission"
              example="$10/day maintenance = $0.10/day to Foundation"
            />
          </div>
          <div className="mt-8 text-center bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <p className="text-lg font-semibold text-amber-400 mb-2">
              Optional Charity Staking (Coming Soon)
            </p>
            <p className="text-gray-300">
              Stake your TYT tokens and donate 100% of rewards directly to the Foundation while maintaining your principal.
            </p>
          </div>
        </div>

        {/* Foundation Focus Areas */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Foundation Focus Areas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FocusCard
              icon={Building}
              title="Research Grants"
              description="Funding innovative research projects at leading institutions worldwide"
              items={[
                "Novel treatment development",
                "Clinical trials for new therapies",
                "Precision medicine and genomics",
                "Immunotherapy research",
                "Quality of life studies"
              ]}
            />
            <FocusCard
              icon={Users}
              title="Family Support"
              description="Direct assistance to families facing the challenges of pediatric brain cancer"
              items={[
                "Financial assistance for treatment",
                "Travel and accommodation support",
                "Psychological counseling services",
                "Educational resources",
                "Community support programs"
              ]}
            />
            <FocusCard
              icon={Award}
              title="Medical Equipment"
              description="Purchasing cutting-edge equipment for diagnosis and treatment"
              items={[
                "Advanced imaging systems (MRI, PET)",
                "Surgical robotics",
                "Radiation therapy equipment",
                "Laboratory instrumentation",
                "Telemedicine infrastructure"
              ]}
            />
            <FocusCard
              icon={FileText}
              title="Awareness & Education"
              description="Raising global awareness and educating communities"
              items={[
                "Public awareness campaigns",
                "Educational materials for families",
                "Medical professional training",
                "Advocacy for policy changes",
                "International conferences"
              ]}
            />
          </div>
        </div>

        {/* Transparency & Accountability */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-10 mb-12">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Unprecedented Transparency</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Every donation is recorded on the blockchain, providing complete transparency and accountability.
                You can verify exactly how your contributions are being used.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/20">
              <h3 className="font-bold text-xl mb-3 text-blue-400">Smart Contract Donations</h3>
              <p className="text-gray-300 mb-4">
                Automated contributions via smart contracts ensure every transaction is recorded permanently on-chain.
              </p>
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <span>View Contract</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/20">
              <h3 className="font-bold text-xl mb-3 text-blue-400">Public Wallet</h3>
              <p className="text-gray-300 mb-4">
                All Foundation funds are held in publicly auditable wallets. Anyone can verify balances and transactions.
              </p>
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <span>View Wallet</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/20">
              <h3 className="font-bold text-xl mb-3 text-blue-400">Annual Reports</h3>
              <p className="text-gray-300 mb-4">
                Comprehensive annual reports detail all grants, expenditures, and outcomes with full financial transparency.
              </p>
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <span>View Reports</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Clinical Partners */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-10 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Clinical & Research Partners</h2>
          <p className="text-gray-300 text-center mb-8 max-w-3xl mx-auto">
            We partner with world-leading institutions to maximize the impact of every donation.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <PartnerCard
              name="Schneider Children's Medical Center"
              location="Tel Aviv, Israel"
              focus="Pediatric Neuro-Oncology"
              status="Partnership Pending"
            />
            <PartnerCard
              name="St. Jude Children's Research Hospital"
              location="Memphis, USA"
              focus="Brain Tumor Research"
              status="Partnership Pending"
            />
            <PartnerCard
              name="Great Ormond Street Hospital"
              location="London, UK"
              focus="Pediatric Cancer Treatment"
              status="Partnership Pending"
            />
            <PartnerCard
              name="Dana-Farber Cancer Institute"
              location="Boston, USA"
              focus="Pediatric Brain Tumors"
              status="Partnership Pending"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              We are actively establishing partnerships with leading institutions worldwide.
              Interested in partnering? Contact us at{' '}
              <a href="mailto:foundation@takeyourtoken.app" className="text-blue-400 hover:underline">
                foundation@takeyourtoken.app
              </a>
            </p>
          </div>
        </div>

        {/* Real Stories (Placeholder) */}
        <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/30 rounded-2xl p-10 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Stories of Hope</h2>
          <p className="text-gray-300 text-center mb-8 max-w-3xl mx-auto">
            Once we launch, this section will feature real stories from families we've helped and
            research breakthroughs we've funded.
          </p>

          <div className="text-center">
            <div className="inline-block bg-gray-800 rounded-xl p-8 border border-gray-700">
              <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <p className="text-xl font-semibold mb-2">Coming Soon</p>
              <p className="text-gray-400">
                Patient stories, research outcomes, and impact reports will be featured here after launch.
              </p>
            </div>
          </div>
        </div>

        {/* How to Get Involved */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-10 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Get Involved</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ActionCard
              title="Use the Platform"
              description="Every mining reward, marketplace purchase, and maintenance payment automatically contributes."
              action="Start Mining"
              link="/signup"
            />
            <ActionCard
              title="Direct Donation"
              description="Make a one-time or recurring donation directly to the Foundation (tax-deductible in eligible jurisdictions)."
              action="Donate Now"
              link="#donate"
              comingSoon
            />
            <ActionCard
              title="Charity Staking"
              description="Stake TYT tokens and donate 100% of staking rewards while keeping your principal intact."
              action="Learn More"
              link="#staking"
              comingSoon
            />
          </div>
        </div>

        {/* Financial Transparency */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-10 mb-12">
          <h2 className="text-3xl font-bold mb-6">Financial Transparency</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-semibold text-lg">Total Collected (All-Time)</p>
                <p className="text-gray-400 text-sm">Since launch</p>
              </div>
              <p className="text-3xl font-bold text-green-400">$0</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="font-semibold mb-2">Allocated to Research</p>
                <div className="flex justify-between items-center">
                  <div className="flex-1 bg-gray-700 rounded-full h-3 mr-4">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <span className="text-blue-400 font-bold">$0 (60%)</span>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="font-semibold mb-2">Family Support Programs</p>
                <div className="flex justify-between items-center">
                  <div className="flex-1 bg-gray-700 rounded-full h-3 mr-4">
                    <div className="bg-pink-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <span className="text-pink-400 font-bold">$0 (25%)</span>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="font-semibold mb-2">Medical Equipment</p>
                <div className="flex justify-between items-center">
                  <div className="flex-1 bg-gray-700 rounded-full h-3 mr-4">
                    <div className="bg-purple-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <span className="text-purple-400 font-bold">$0 (10%)</span>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="font-semibold mb-2">Admin & Operations</p>
                <div className="flex justify-between items-center">
                  <div className="flex-1 bg-gray-700 rounded-full h-3 mr-4">
                    <div className="bg-amber-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <span className="text-amber-400 font-bold">$0 (5%)</span>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm text-center mt-6">
              All figures will be updated in real-time after platform launch.
              Historical data will be maintained permanently on-chain.
            </p>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">For Families</h3>
              <p className="text-gray-300 mb-4">
                If your family is affected by pediatric brain cancer and you need support:
              </p>
              <p className="text-white font-semibold">foundation@takeyourtoken.app</p>
              <p className="text-gray-400 text-sm mt-2">We will respond within 24 hours</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">For Researchers</h3>
              <p className="text-gray-300 mb-4">
                Interested in applying for a research grant or establishing a partnership:
              </p>
              <p className="text-white font-semibold">research@takeyourtoken.app</p>
              <p className="text-gray-400 text-sm mt-2">Grant applications open Q2 2025</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">For Press</h3>
              <p className="text-gray-300 mb-4">
                Media inquiries and press releases:
              </p>
              <p className="text-white font-semibold">press@takeyourtoken.app</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">For General Inquiries</h3>
              <p className="text-gray-300 mb-4">
                Questions about the Foundation or how to help:
              </p>
              <p className="text-white font-semibold">support@takeyourtoken.app</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
              Every Transaction Matters
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join us in the fight against pediatric brain cancer. Start mining, support research, save lives.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:shadow-pink-500/50"
          >
            <Heart className="w-6 h-6" fill="white" />
            Start Making a Difference
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color, trend }: any) {
  const colorClasses: any = {
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/50',
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/50',
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/50'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6`}>
      <Icon className={`w-8 h-8 text-${color}-400 mb-3`} />
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-gray-300 font-semibold mb-2">{label}</p>
      <p className="text-sm text-gray-400">{trend}</p>
    </div>
  );
}

function ContributionCard({ title, percentage, description, example }: any) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold text-pink-400 mb-3">{percentage}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300 mb-3">{description}</p>
      <p className="text-sm text-gray-400 italic">Example: {example}</p>
    </div>
  );
}

function FocusCard({ icon: Icon, title, description, items }: any) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0 border border-pink-500/50">
          <Icon className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      <ul className="space-y-2 ml-4">
        {items.map((item: string, idx: number) => (
          <li key={idx} className="flex items-start gap-2 text-gray-300">
            <span className="text-pink-400 mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PartnerCard({ name, location, focus, status }: any) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-bold mb-2">{name}</h3>
      <p className="text-gray-400 text-sm mb-1">{location}</p>
      <p className="text-blue-400 text-sm mb-3">{focus}</p>
      <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
        {status}
      </span>
    </div>
  );
}

function ActionCard({ title, description, action, link, comingSoon }: any) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300 mb-6">{description}</p>
      {comingSoon ? (
        <button disabled className="w-full px-6 py-3 bg-gray-700 text-gray-400 rounded-lg font-semibold cursor-not-allowed">
          Coming Soon
        </button>
      ) : (
        <Link
          to={link}
          className="block w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg font-semibold text-center hover:from-pink-600 hover:to-red-600 transition-all"
        >
          {action}
        </Link>
      )}
    </div>
  );
}
