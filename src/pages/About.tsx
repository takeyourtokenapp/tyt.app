import { ArrowLeft, Target, Users, Heart, Shield, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              <span className="font-bold text-lg">About TYT</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-transparent bg-clip-text">
            Take Your Token
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            The world's first Web3 mining platform where every transaction supports
            children's brain cancer research
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 md:p-12 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/50">
              <Target className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            At TakeYourToken, we believe that cryptocurrency mining can be more than just profitable—it can be purposeful.
            Our platform combines cutting-edge Web3 technology with a social mission: fighting children's brain cancer.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            Every transaction on our platform automatically contributes to the TYT Children's Brain Cancer Research & Support Foundation,
            turning everyday crypto activities into meaningful impact for families facing one of the most devastating childhood diseases.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/50 mb-4">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Mining & Economy</h3>
            <p className="text-gray-400">
              NFT-powered digital miners generating daily BTC rewards with transparent,
              sustainable tokenomics powered by TYT token.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/50 mb-4">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Education</h3>
            <p className="text-gray-400">
              TYT Academy provides world-class blockchain education, empowering
              millions to understand and benefit from Web3 technology.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/20 to-red-500/20 flex items-center justify-center border border-pink-500/50 mb-4">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Foundation</h3>
            <p className="text-gray-400">
              TYT Children's Brain Cancer Foundation funds research, supports families,
              and brings hope to children fighting pediatric brain tumors.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              TakeYourToken was born from a simple question: <em>What if cryptocurrency mining could save lives?</em>
            </p>
            <p>
              Founded in 2024, our platform emerged from the intersection of blockchain innovation and
              social responsibility. We recognized that the crypto industry generates enormous value,
              but often lacks meaningful connection to real-world impact.
            </p>
            <p>
              Pediatric brain tumors are the <strong>leading cause of cancer-related death in children</strong>,
              yet research funding remains critically insufficient. We decided to change that by building
              a sustainable business model where every user automatically becomes a contributor to life-saving research.
            </p>
            <p>
              Today, TakeYourToken serves thousands of users worldwide, combining profitable Bitcoin mining
              with transparent charitable giving. Our platform has generated over $[XX,XXX] in research funding,
              supporting [X] active clinical trials and [XX] families affected by pediatric brain cancer.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                Transparency
              </h3>
              <p className="text-gray-400">
                Every transaction, every fee, every donation is tracked on-chain and publicly visible.
                We publish monthly reports and maintain full financial transparency.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Impact-First
              </h3>
              <p className="text-gray-400">
                Profit is important, but purpose comes first. We measure success not just in revenue,
                but in lives touched and families supported.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Community-Driven
              </h3>
              <p className="text-gray-400">
                Our governance model gives TYT token holders real voting power over platform decisions,
                discount structures, and foundation allocations.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-400" />
                Accessibility
              </h3>
              <p className="text-gray-400">
                We believe crypto mining should be accessible to everyone, not just those with technical
                knowledge or large capital. Our NFT miners make it simple.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border-2 border-amber-500/50 mx-auto mb-4">
                <Users className="w-16 h-16 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg mb-1">Leadership Team</h3>
              <p className="text-gray-400 text-sm mb-2">Executive & Strategy</p>
              <p className="text-gray-500 text-sm">
                20+ years combined experience in blockchain, finance, and healthcare technology
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border-2 border-blue-500/50 mx-auto mb-4">
                <Shield className="w-16 h-16 text-blue-400" />
              </div>
              <h3 className="font-bold text-lg mb-1">Technical Team</h3>
              <p className="text-gray-400 text-sm mb-2">Engineering & Security</p>
              <p className="text-gray-500 text-sm">
                Full-stack blockchain developers with expertise in smart contracts and custody solutions
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/20 to-red-500/20 flex items-center justify-center border-2 border-pink-500/50 mx-auto mb-4">
                <Heart className="w-16 h-16 text-pink-400" />
              </div>
              <h3 className="font-bold text-lg mb-1">Foundation Team</h3>
              <p className="text-gray-400 text-sm mb-2">Medical & Charity Operations</p>
              <p className="text-gray-500 text-sm">
                Medical advisors, oncology researchers, and nonprofit management professionals
              </p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6 text-center">
            <p className="text-gray-300">
              <strong>We're Growing!</strong> Interested in joining our mission?
              Contact us at <a href="mailto:careers@takeyourtoken.app" className="text-blue-400 hover:text-blue-300">careers@takeyourtoken.app</a>
            </p>
          </div>
        </div>

        {/* By the Numbers */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-400 mb-2">[TBD]</div>
              <div className="text-gray-400">Active Miners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">$[TBD]</div>
              <div className="text-gray-400">Foundation Donations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">[TBD]</div>
              <div className="text-gray-400">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">[TBD]</div>
              <div className="text-gray-400">Families Supported</div>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            *Numbers will be updated as platform launches and scales
          </p>
        </div>

        {/* Partnerships */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Partners & Supporters</h2>
          <p className="text-gray-400 text-center mb-8">
            We collaborate with leading organizations in blockchain, healthcare, and pediatric oncology
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 text-center">
              <div className="font-bold text-lg mb-2">Blockchain Partners</div>
              <p className="text-gray-400 text-sm">
                [Partner logos and names to be added]
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 text-center">
              <div className="font-bold text-lg mb-2">Medical Institutions</div>
              <p className="text-gray-400 text-sm">
                [Hospital and research center partnerships]
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 text-center">
              <div className="font-bold text-lg mb-2">Technology Partners</div>
              <p className="text-gray-400 text-sm">
                Supabase, SendGrid, [Additional partners]
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/50 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-300 mb-6">
            Questions? Partnerships? Media inquiries? We'd love to hear from you.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="font-semibold mb-2">General</div>
              <a href="mailto:hello@takeyourtoken.app" className="text-amber-400 hover:text-amber-300 text-sm">
                hello@takeyourtoken.app
              </a>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="font-semibold mb-2">Support</div>
              <a href="mailto:support@takeyourtoken.app" className="text-amber-400 hover:text-amber-300 text-sm">
                support@takeyourtoken.app
              </a>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="font-semibold mb-2">Press</div>
              <a href="mailto:press@takeyourtoken.app" className="text-amber-400 hover:text-amber-300 text-sm">
                press@takeyourtoken.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
