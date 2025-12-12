import { useState } from 'react';
import {
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Zap,
  Shield,
  Wallet,
  ShoppingCart,
  Settings,
  TrendingUp,
  Award,
  Heart,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
interface FAQCategory {
  id: string;
  title: string;
  icon: any;
  questions: FAQItem[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    questions: [
      {
        id: 'gs-1',
        question: 'What is TakeYourToken and how does it work?',
        answer: 'TakeYourToken is a Web3 mining platform where you can own NFT miners that generate real Bitcoin rewards 24/7. Each NFT miner represents actual mining capacity in professional data centers. You earn daily BTC rewards based on your miner\'s hashrate (TH/s), after electricity and maintenance fees are deducted.'
      },
      {
        id: 'gs-2',
        question: 'How do I get started?',
        answer: 'Getting started is simple: 1) Sign up for a free account, 2) Complete basic verification (KYC Level 0 for $100/day withdrawals), 3) Purchase your first NFT miner from the marketplace, 4) Start earning BTC rewards automatically. Your miner begins working immediately after purchase.'
      },
      {
        id: 'gs-3',
        question: 'Do I need technical knowledge to use the platform?',
        answer: 'No technical knowledge required! We handle all the technical aspects including mining hardware, electricity, cooling, maintenance, and network optimization. You simply own the NFT miner and collect rewards. Our platform is designed to be beginner-friendly with helpful guides and 24/7 support.'
      },
      {
        id: 'gs-4',
        question: 'What cryptocurrencies does the platform support?',
        answer: 'The platform supports multiple cryptocurrencies: Bitcoin (BTC), TYT token (Solana), USDT, Ethereum (ETH), Tron (TRX), XRP, and TON. You can deposit with any supported crypto, and withdraw BTC rewards to your preferred blockchain network.'
      }
    ]
  },
  {
    id: 'nft-miners',
    title: 'NFT Miners',
    icon: Zap,
    questions: [
      {
        id: 'nft-1',
        question: 'What is an NFT miner and how does it generate rewards?',
        answer: 'An NFT miner is a digital asset that represents real mining power (hashrate) in our partner data centers. Each NFT has specific specifications: TH/s (hashrate), W/TH (efficiency), region, and maintenance rate. The miner processes Bitcoin transactions 24/7, and you receive daily BTC rewards proportional to your share of the network.'
      },
      {
        id: 'nft-2',
        question: 'Can I own multiple miners?',
        answer: 'Yes! You can own unlimited NFT miners. Many users build diversified portfolios with different miner types, regions, and efficiency levels to optimize their returns and spread risk. Each miner operates independently and generates separate reward streams.'
      },
      {
        id: 'nft-3',
        question: 'Can I upgrade my miner?',
        answer: 'Yes, miners support two types of upgrades: 1) Hashrate upgrades - increase your TH/s to mine more Bitcoin, 2) Efficiency upgrades - reduce W/TH to lower electricity costs. Upgrades are purchased with TYT tokens and permanently improve your miner\'s performance.'
      },
      {
        id: 'nft-4',
        question: 'What happens if my miner becomes unprofitable?',
        answer: 'If Bitcoin price drops significantly or network difficulty increases dramatically, daily rewards may not cover maintenance fees. In this case, we provide a 30-day grace period where your miner remains active. You can: 1) Wait for market conditions to improve, 2) Add funds to cover maintenance, 3) Upgrade efficiency to reduce costs, or 4) Sell your miner on the marketplace.'
      }
    ]
  },
  {
    id: 'rewards',
    title: 'Rewards & Mining',
    icon: TrendingUp,
    questions: [
      {
        id: 'rew-1',
        question: 'How are daily rewards calculated?',
        answer: 'Daily rewards follow this formula: Gross BTC = (Your TH/s ÷ Network Hashrate) × Daily Block Rewards. Then we deduct: Electricity costs (based on W/TH × regional power price) + Service fee (varies by plan). Net BTC = Gross BTC - Costs. Rewards are automatically deposited to your wallet every 24 hours at midnight UTC.'
      },
      {
        id: 'rew-2',
        question: 'When do I receive my mining rewards?',
        answer: 'Mining rewards are calculated and distributed automatically every 24 hours at 00:00 UTC. You\'ll see your pending rewards update in real-time throughout the day, and the final payout is credited to your wallet at midnight. You can withdraw anytime after rewards are credited.'
      },
      {
        id: 'rew-3',
        question: 'What affects my mining profitability?',
        answer: 'Four main factors affect profitability: 1) Bitcoin price - higher price = more valuable rewards, 2) Network difficulty - lower difficulty = easier to mine, 3) Your miner\'s efficiency (W/TH) - lower = less electricity costs, 4) Regional electricity rates - data center location matters. Monitor these factors in your dashboard.'
      },
      {
        id: 'rew-4',
        question: 'Can I reinvest my rewards automatically?',
        answer: 'Yes! Enable auto-reinvest in your miner settings. You can set a percentage (25%, 50%, 75%, 100%) of daily rewards to automatically purchase additional TH/s. This compounds your mining power over time. You can adjust or disable auto-reinvest anytime.'
      }
    ]
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Fees',
    icon: Settings,
    questions: [
      {
        id: 'main-1',
        question: 'What are maintenance fees and how do they work?',
        answer: 'Maintenance fees cover electricity, cooling, hardware maintenance, and facility operations. Fees are calculated daily based on: 1) Your miner\'s power consumption (W/TH × TH/s), 2) Regional electricity rates, 3) Service fee (varies by VIP tier). Fees are automatically deducted from your daily BTC rewards before payout.'
      },
      {
        id: 'main-2',
        question: 'How can I pay maintenance fees?',
        answer: 'You can pay maintenance fees with three options: 1) TYT token (20% discount + automatic burn), 2) USDT (no discount), 3) Auto-deduct from BTC rewards (no discount). Paying with TYT is recommended for maximum savings and supports the token economy.'
      },
      {
        id: 'main-3',
        question: 'What is the TYT discount system?',
        answer: 'Paying maintenance with TYT tokens provides up to 20% discount based on your VIP tier: Bronze (2%), Silver (5%), Gold (9%), Platinum (13%), Diamond (18%), VIP (20%). All TYT used for maintenance is automatically burned, reducing total supply. The Service Button provides an additional 3% daily discount (resets every 24h).'
      },
      {
        id: 'main-4',
        question: 'What happens if I don\'t pay maintenance fees?',
        answer: 'If daily rewards don\'t cover fees and you have insufficient balance, your miner enters a 30-day grace period. During this time: Your miner remains operational but rewards are held. You can add funds to clear the deficit, or sell your miner on the marketplace. After 30 days without payment, the miner is suspended until fees are paid.'
      }
    ]
  },
  {
    id: 'wallet',
    title: 'Wallet & Withdrawals',
    icon: Wallet,
    questions: [
      {
        id: 'wal-1',
        question: 'What withdrawal networks are supported?',
        answer: 'We support withdrawals to 8 networks: Bitcoin (mainnet), Lightning Network (instant, low fees), Liquid Network (fast, private), Wrapped Bitcoin (wBTC on Ethereum), Solana, Tron, XRP, and TON. Each network has different speed and fee characteristics - choose based on your needs.'
      },
      {
        id: 'wal-2',
        question: 'What are the withdrawal limits and fees?',
        answer: 'Withdrawal limits depend on your KYC level: Level 0 ($100/day), Level 1 ($1,000/day), Level 2 ($10,000/day), Level 3 (Unlimited). Network fees vary: Bitcoin (0.0001 BTC), Lightning (<$0.01), Liquid (0.00001 BTC), wBTC (gas fees), Other networks (minimal). We use dynamic fee estimation for optimal confirmation times.'
      },
      {
        id: 'wal-3',
        question: 'How long do withdrawals take?',
        answer: 'Withdrawal times vary by network: Lightning Network (instant, <1 second), Liquid Network (2 minutes), Bitcoin mainnet (10-60 minutes, 1-6 confirmations), Ethereum/wBTC (5-15 minutes), Solana (30 seconds), Tron (3 minutes), XRP (3-5 seconds). First withdrawal per day may require additional security verification.'
      },
      {
        id: 'wal-4',
        question: 'Is my wallet secure?',
        answer: 'Yes! We use enterprise-grade security: 1) Fireblocks custody for institutional-level protection, 2) Multi-signature cold storage for offline funds, 3) Real-time blockchain monitoring, 4) 2FA/Passkey authentication required, 5) Withdrawal whitelist available, 6) Insurance coverage for platform funds. You can also connect external Web3 wallets.'
      }
    ]
  },
  {
    id: 'kyc',
    title: 'KYC & Verification',
    icon: Shield,
    questions: [
      {
        id: 'kyc-1',
        question: 'Why is KYC verification required?',
        answer: 'KYC (Know Your Customer) verification is required for regulatory compliance and fraud prevention. It protects both users and the platform from money laundering, identity theft, and other illegal activities. All major crypto platforms require KYC for withdrawals above certain thresholds.'
      },
      {
        id: 'kyc-2',
        question: 'What are the KYC verification levels?',
        answer: 'We have 4 KYC levels: Level 0 (Email only, $100/day withdrawals), Level 1 (ID document, $1,000/day), Level 2 (ID + Selfie + Address proof, $10,000/day), Level 3 (Enhanced due diligence, Unlimited). Higher levels unlock larger withdrawal limits, marketplace access, and VIP benefits.'
      },
      {
        id: 'kyc-3',
        question: 'How long does KYC verification take?',
        answer: 'Verification times vary by level: Level 1 (5-15 minutes, automated), Level 2 (2-24 hours, manual review), Level 3 (1-3 business days, enhanced due diligence). Most users complete Level 1 instantly. We\'ll email you when verification is complete or if additional documents are needed.'
      },
      {
        id: 'kyc-4',
        question: 'What documents do I need for KYC?',
        answer: 'Required documents by level: Level 1 (Government-issued ID: passport, driver\'s license, or national ID), Level 2 (ID + selfie photo + proof of address: utility bill, bank statement, or government letter dated within 3 months), Level 3 (All Level 2 docs + source of funds documentation). All documents must be clear, unedited, and valid.'
      }
    ]
  },
  {
    id: 'tyt-token',
    title: 'TYT Token',
    icon: Award,
    questions: [
      {
        id: 'tyt-1',
        question: 'What is the TYT token and what is it used for?',
        answer: 'TYT is our native utility token built on Solana. Use cases: 1) Pay maintenance fees (20% discount), 2) Purchase miner upgrades, 3) Marketplace transactions (lower fees), 4) Governance voting (veTYT), 5) Academy course unlocks, 6) VIP tier benefits. All TYT used in the ecosystem is burned, creating deflationary pressure.'
      },
      {
        id: 'tyt-2',
        question: 'How does the TYT burn mechanism work?',
        answer: 'Every time TYT is used on the platform, tokens are permanently burned (removed from circulation): Maintenance payments (100% burned), Marketplace fees (50% burned), Upgrade purchases (75% burned), Weekly automated burns (from treasury). This deflationary model increases scarcity over time. View burn statistics on the TYT Trading page.'
      },
      {
        id: 'tyt-3',
        question: 'What is veTYT and how does governance work?',
        answer: 'veTYT (vote-escrowed TYT) is obtained by locking TYT tokens for 1 week to 4 years. Longer lock = more voting power. Vote on: 1) Discount curve adjustments, 2) Maintenance fee structure, 3) Burn schedule parameters, 4) Foundation donation percentages, 5) New feature proposals. One vote = one TYT locked for 4 years.'
      },
      {
        id: 'tyt-4',
        question: 'Where can I buy or sell TYT tokens?',
        answer: 'TYT can be traded on: 1) Our integrated TYT Trading page (direct swap with USDT), 2) Raydium DEX (Solana), 3) pump.fun (original listing platform). Always verify the correct contract address to avoid scams. We recommend using our platform for the best rates and security.'
      }
    ]
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    icon: ShoppingCart,
    questions: [
      {
        id: 'mark-1',
        question: 'How does the NFT miner marketplace work?',
        answer: 'The marketplace lets users buy and sell NFT miners peer-to-peer. Sellers list miners with asking price (TYT), buyers browse and purchase instantly. Platform takes 2% fee (1% to Foundation, 0.5% burned, 0.5% operations). Original miner creator receives 1% royalty. All transactions are on-chain and transparent.'
      },
      {
        id: 'mark-2',
        question: 'How do I list my miner for sale?',
        answer: 'To list a miner: 1) Go to My Miners page, 2) Click "Sell" on the miner card, 3) Set your asking price in TYT, 4) Review fees (2% marketplace + 1% royalty), 5) Confirm listing. Your miner continues generating rewards while listed. You can cancel or adjust price anytime. Sales are instant when a buyer accepts your price.'
      },
      {
        id: 'mark-3',
        question: 'What should I look for when buying a miner?',
        answer: 'Key factors to evaluate: 1) Hashrate (TH/s) - higher = more rewards, 2) Efficiency (W/TH) - lower = less electricity costs, 3) Region - affects electricity rates, 4) Age/condition - newer miners may have longer lifespan, 5) Price vs. new miner cost, 6) Current daily ROI, 7) Seller reputation. Use our ROI calculator to compare options.'
      },
      {
        id: 'mark-4',
        question: 'Can I make offers on listed miners?',
        answer: 'Not currently - marketplace operates on "buy it now" basis at seller\'s asking price. However, you can message sellers (coming soon) to negotiate prices off-platform. We\'re developing an auction system and offer/bid functionality for a future update based on user feedback.'
      }
    ]
  },
  {
    id: 'foundation',
    title: 'Foundation',
    icon: Heart,
    questions: [
      {
        id: 'found-1',
        question: 'What is the TYT Children\'s Brain Cancer Foundation?',
        answer: 'The TYT Foundation is a charitable organization dedicated to funding pediatric brain cancer research and supporting affected families. 1% of every transaction on the platform automatically goes to the Foundation. Funds support clinical trials, medical equipment, family assistance programs, and research grants at leading hospitals worldwide.'
      },
      {
        id: 'found-2',
        question: 'How can I verify the foundation\'s transparency?',
        answer: 'Complete transparency is a core value: 1) All donations tracked on blockchain (view wallet addresses), 2) Quarterly public impact reports, 3) Annual third-party financial audits, 4) Live dashboard showing total raised, families helped, grants awarded, 5) Direct hospital partnerships listed, 6) Research outcomes published. Download reports from the Foundation page.'
      },
      {
        id: 'found-3',
        question: 'Can I make additional donations to the Foundation?',
        answer: 'Yes! You can donate directly via: 1) Foundation page donation widget (USDT, BTC, TYT), 2) Charity Staking (stake TYT, rewards go to Foundation), 3) Voluntary percentage from your mining rewards. Donations are tax-deductible where applicable (consult your tax advisor). Every donation is acknowledged and tracked transparently.'
      },
      {
        id: 'found-4',
        question: 'What impact has the Foundation made?',
        answer: 'Since launch, the Foundation has: Donated $256,890 total, Helped 127 families with direct assistance, Awarded 4 research grants ($645K total), Funded 3 active clinical trials, Partnered with 6 major hospitals (USA, Israel, UK, Canada, Germany), Purchased 2 MRI machines for early detection. View detailed impact reports on the Foundation page.'
      }
    ]
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (id: string) => {
    const newOpen = new Set(openQuestions);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenQuestions(newOpen);
  };

  const filteredCategories = FAQ_CATEGORIES.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return false;

    if (searchQuery.trim() === '') return true;

    const query = searchQuery.toLowerCase();
    return category.questions.some(q =>
      q.question.toLowerCase().includes(query) ||
      q.answer.toLowerCase().includes(query)
    );
  });

  const allQuestions = FAQ_CATEGORIES.flatMap(cat =>
    cat.questions.map(q => ({ ...q, categoryId: cat.id, categoryTitle: cat.title }))
  );

  const searchResults = searchQuery.trim() !== ''
    ? allQuestions.filter(q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions and get support for your TakeYourToken journey
          </p>
        </div>

        <div className="mb-12">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers... (e.g., 'how to withdraw', 'KYC verification')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-gray-800 border border-gray-700 rounded-xl text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {searchQuery.trim() !== '' && (
            <div className="max-w-3xl mx-auto mt-4">
              <p className="text-gray-400 mb-3">Found {searchResults.length} results for "{searchQuery}"</p>
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.slice(0, 5).map(result => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setSelectedCategory(result.categoryId);
                        setSearchQuery('');
                        toggleQuestion(result.id);
                        setTimeout(() => {
                          document.getElementById(`question-${result.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }}
                      className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                    >
                      <p className="font-semibold text-white mb-1">{result.question}</p>
                      <p className="text-sm text-gray-400 line-clamp-2">{result.answer}</p>
                      <p className="text-xs text-blue-400 mt-2">{result.categoryTitle}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg text-center">
                  <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No results found. Try different keywords or browse categories below.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-4 rounded-lg font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Categories
            </button>
            {FAQ_CATEGORIES.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg font-semibold transition-all flex items-center gap-3 ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          {filteredCategories.map(category => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-6 bg-gray-900/50 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                    <span className="ml-auto px-3 py-1 bg-gray-700 rounded-full text-sm font-semibold">
                      {category.questions.length} questions
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-700">
                  {category.questions.map(question => {
                    const isOpen = openQuestions.has(question.id);
                    return (
                      <div key={question.id} id={`question-${question.id}`} className="transition-colors hover:bg-gray-800/50">
                        <button
                          onClick={() => toggleQuestion(question.id)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left"
                        >
                          <span className="font-semibold text-white pr-4">{question.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-5">
                            <p className="text-gray-300 leading-relaxed">{question.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && searchQuery.trim() === '' && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Select a category to view questions</p>
          </div>
        )}

        <div className="mt-16 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Still Need Help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
              <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Live Chat</h3>
              <p className="text-gray-400 text-sm mb-4">Chat with our support team</p>
              <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                Start Chat
              </button>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
              <Mail className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Email Support</h3>
              <p className="text-gray-400 text-sm mb-4">We'll respond within 24 hours</p>
              <a
                href="mailto:support@takeyourtoken.app"
                className="inline-block px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                Send Email
              </a>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
              <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Documentation</h3>
              <p className="text-gray-400 text-sm mb-4">Detailed guides and tutorials</p>
              <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 mx-auto">
                View Docs
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
