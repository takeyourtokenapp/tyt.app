import { useState } from 'react';
import { Heart, CreditCard, Bitcoin, DollarSign, User, MessageSquare, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function DonationWidget() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'BTC' | 'TYT'>('USD');
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isDonating, setIsDonating] = useState(false);

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'BTC':
        return '₿';
      case 'TYT':
        return 'TYT ';
      default:
        return '$';
    }
  };

  const handleDonate = async () => {
    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    setIsDonating(true);
    try {
      const usdEquivalent = currency === 'BTC'
        ? donationAmount * 95000
        : currency === 'TYT'
        ? donationAmount * 0.05
        : donationAmount;

      const { error } = await supabase
        .from('foundation_donations')
        .insert({
          user_id: user?.id || null,
          amount: donationAmount,
          currency: currency,
          usd_equivalent: usdEquivalent,
          donor_name: isAnonymous ? null : (donorName || 'Anonymous'),
          message: message || null,
          is_anonymous: isAnonymous,
          status: 'pending'
        });

      if (error) throw error;

      alert(`Thank you for your donation of ${getCurrencySymbol()}${donationAmount}! Your contribution will help children fighting brain cancer.`);

      setAmount('');
      setDonorName('');
      setMessage('');
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Failed to process donation. Please try again.');
    } finally {
      setIsDonating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border-2 border-pink-500/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl">
          <Heart size={32} className="text-white" />
        </div>
        <div>
          <h3 className="text-3xl font-bold">Make a Donation</h3>
          <p className="text-gray-400">Direct support for children's brain cancer research</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">Select Currency</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setCurrency('USD')}
              className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                currency === 'USD'
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-gray-700 hover:border-green-700'
              }`}
            >
              <DollarSign size={20} />
              <span className="font-bold">USD</span>
            </button>
            <button
              onClick={() => setCurrency('BTC')}
              className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                currency === 'BTC'
                  ? 'border-orange-500 bg-orange-500/20'
                  : 'border-gray-700 hover:border-orange-700'
              }`}
            >
              <Bitcoin size={20} />
              <span className="font-bold">BTC</span>
            </button>
            <button
              onClick={() => setCurrency('TYT')}
              className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                currency === 'TYT'
                  ? 'border-amber-500 bg-amber-500/20'
                  : 'border-gray-700 hover:border-amber-700'
              }`}
            >
              <CreditCard size={20} />
              <span className="font-bold">TYT</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Donation Amount</label>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-pink-500 rounded-lg font-semibold transition-all"
              >
                {getCurrencySymbol()}{quickAmount}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
              {getCurrencySymbol()}
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Custom amount"
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-xl font-bold focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
              step={currency === 'BTC' ? '0.0001' : '1'}
            />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 rounded border-gray-600 text-pink-500 focus:ring-pink-500"
            />
            <label htmlFor="anonymous" className="text-sm font-medium cursor-pointer">
              Donate anonymously
            </label>
          </div>

          {!isAnonymous && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Your Name (Optional)</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Dedication Message (Optional)</label>
                <div className="relative">
                  <MessageSquare size={18} className="absolute left-3 top-3 text-gray-500" />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="In memory of..."
                    rows={3}
                    maxLength={200}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all resize-none"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {message.length}/200
                </div>
              </div>
            </div>
          )}
        </div>

        {amount && parseFloat(amount) > 0 && (
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Your Donation</span>
              <span className="text-2xl font-bold text-pink-400">
                {getCurrencySymbol()}{parseFloat(amount).toFixed(currency === 'BTC' ? 8 : 2)}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              100% goes directly to children's brain cancer research and family support
            </div>
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-gray-300 space-y-2">
          <div className="font-bold text-blue-400 flex items-center gap-2">
            <Heart size={16} />
            How Your Donation Helps
          </div>
          <ul className="space-y-1 list-disc list-inside">
            <li>Funds cutting-edge research into pediatric brain tumors</li>
            <li>Supports families with treatment costs and travel</li>
            <li>Provides medical equipment to partner hospitals</li>
            <li>Finances clinical trials for new treatments</li>
            <li>100% transparent on-chain tracking</li>
          </ul>
        </div>

        <button
          onClick={handleDonate}
          disabled={isDonating || !amount || parseFloat(amount) <= 0}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDonating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Heart size={20} />
              Donate {amount && parseFloat(amount) > 0 ? `${getCurrencySymbol()}${parseFloat(amount).toFixed(currency === 'BTC' ? 8 : 2)}` : 'Now'}
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Download size={14} />
          <span>Tax receipt will be sent to your email</span>
        </div>
      </div>
    </div>
  );
}
