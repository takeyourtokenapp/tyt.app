import { useKYCStatus, useUserProfile } from '../hooks/useAccessControl';
import { CheckCircle2, Clock, XCircle, AlertCircle, Upload, Shield, Award } from 'lucide-react';
import { getNextTierBenefits } from '../utils/accessControl';

export default function KYCStatus() {
  const { kycStatus, loading, refresh } = useKYCStatus();
  const { profile } = useUserProfile();

  if (loading || !kycStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-3 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statusConfig = {
    not_submitted: {
      icon: AlertCircle,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/50',
      label: 'Not Submitted'
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50',
      label: 'Under Review'
    },
    approved: {
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50',
      label: 'Approved'
    },
    rejected: {
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      label: 'Rejected'
    }
  };

  const config = statusConfig[kycStatus.status];
  const StatusIcon = config.icon;
  const nextTierBenefits = profile ? getNextTierBenefits(profile.kyc_tier) : [];

  return (
    <div className="space-y-6">
      <div className={`rounded-xl p-6 border ${config.borderColor} ${config.bgColor}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${config.bgColor}`}>
              <StatusIcon className={`w-6 h-6 ${config.color}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold">KYC Status</h3>
              <p className={`text-sm ${config.color} font-semibold`}>{config.label}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Current Tier</div>
            <div className="text-3xl font-bold text-gold-400">
              {kycStatus.tier}
            </div>
          </div>
        </div>

        {kycStatus.status === 'not_submitted' && (
          <div className="mt-4">
            <p className="text-gray-300 mb-4">
              Complete KYC verification to unlock more features and higher limits.
            </p>
            <button
              onClick={() => window.location.href = '/app/settings?tab=kyc'}
              className="w-full px-4 py-3 bg-gradient-to-r from-gold-500 to-amber-500 rounded-lg font-semibold hover:from-gold-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              Start KYC Verification
            </button>
          </div>
        )}

        {kycStatus.status === 'pending' && (
          <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-300">
              Your documents are being reviewed. This typically takes 1-3 business days.
            </p>
          </div>
        )}

        {kycStatus.status === 'rejected' && (
          <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/50">
            <p className="text-sm text-red-400 font-semibold mb-2">
              Verification rejected
            </p>
            <p className="text-sm text-gray-300">
              Please check your documents and resubmit.
            </p>
          </div>
        )}
      </div>

      {kycStatus.documents.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h4 className="font-bold text-lg mb-4">Submitted Documents</h4>
          <div className="space-y-3">
            {kycStatus.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <div className="font-semibold capitalize">
                    {doc.type.replace(/_/g, ' ')}
                  </div>
                  <div className="text-sm text-gray-400">
                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                  </div>
                  {doc.rejection_reason && (
                    <div className="text-sm text-red-400 mt-1">
                      Reason: {doc.rejection_reason}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {doc.status === 'approved' && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Approved
                    </span>
                  )}
                  {doc.status === 'pending' && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-semibold flex items-center gap-1">
                      <Clock size={14} />
                      Pending
                    </span>
                  )}
                  {doc.status === 'rejected' && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold flex items-center gap-1">
                      <XCircle size={14} />
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {profile && profile.kyc_tier < 3 && nextTierBenefits.length > 0 && (
        <div className="bg-gradient-to-br from-gold-500/10 to-amber-500/10 rounded-xl p-6 border border-gold-500/50">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-gold-400" />
            <h4 className="font-bold text-lg">Tier {profile.kyc_tier + 1} Benefits</h4>
          </div>
          <ul className="space-y-2">
            {nextTierBenefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          {kycStatus.status === 'approved' && (
            <button
              onClick={() => window.location.href = '/app/settings?tab=kyc'}
              className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-gold-500 to-amber-500 rounded-lg font-semibold hover:from-gold-400 hover:to-amber-400 transition-all"
            >
              Upgrade to Tier {profile.kyc_tier + 1}
            </button>
          )}
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-400" />
          <h4 className="font-bold text-lg">KYC Tiers</h4>
        </div>
        <div className="space-y-4">
          {[
            {
              tier: 0,
              name: 'Unverified',
              features: ['View wallet', 'Deposit funds', 'Basic trading']
            },
            {
              tier: 1,
              name: 'Basic',
              features: ['Withdraw funds', 'Stake tokens', 'Buy/sell miners', 'Claim rewards']
            },
            {
              tier: 2,
              name: 'Intermediate',
              features: ['Governance voting', 'Premium trading', 'Higher limits', 'Priority support']
            },
            {
              tier: 3,
              name: 'Advanced',
              features: ['VIP features', 'Exclusive access', 'Maximum limits', 'Dedicated manager']
            }
          ].map((tierInfo) => (
            <div
              key={tierInfo.tier}
              className={`p-4 rounded-lg border ${
                profile && profile.kyc_tier === tierInfo.tier
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold">Tier {tierInfo.tier} - {tierInfo.name}</div>
                {profile && profile.kyc_tier === tierInfo.tier && (
                  <span className="px-2 py-1 bg-gold-500/20 text-gold-400 rounded text-xs font-semibold">
                    Current
                  </span>
                )}
              </div>
              <ul className="space-y-1">
                {tierInfo.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-400 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-gold-400"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
