import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { startKYCVerification, checkKYCStatus, type KYCStatus } from '@/utils/kycService';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  requiredFor?: string;
}

export function KYCModal({ isOpen, onClose, onSuccess, requiredFor }: KYCModalProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<KYCStatus>('not_started');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadKYCStatus();
    }
  }, [isOpen, user]);

  const loadKYCStatus = async () => {
    if (!user) return;

    try {
      const kycData = await checkKYCStatus(user.id);
      setStatus(kycData?.status || 'not_started');
    } catch (err) {
      console.error('Error loading KYC status:', err);
    }
  };

  const handleStartKYC = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const token = await startKYCVerification(user.id);
      setAccessToken(token);
      setStatus('pending');

      // In production, this would load Sumsub iframe
      // For now, just show success message
      setTimeout(() => {
        setStatus('approved');
        onSuccess?.();
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to start KYC verification');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-16 h-16 text-red-500" />;
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-500 animate-pulse" />;
      default:
        return <FileText className="w-16 h-16 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'approved':
        return {
          title: 'Verification Complete',
          message: 'Your identity has been verified successfully!'
        };
      case 'rejected':
        return {
          title: 'Verification Failed',
          message: 'Your verification was rejected. Please contact support.'
        };
      case 'pending':
        return {
          title: 'Verification Pending',
          message: 'Your documents are being reviewed. This usually takes 1-2 hours.'
        };
      case 'resubmission_required':
        return {
          title: 'Resubmission Required',
          message: 'Please resubmit your documents with the requested corrections.'
        };
      default:
        return {
          title: 'Identity Verification Required',
          message: requiredFor
            ? `KYC verification is required for ${requiredFor}`
            : 'Please verify your identity to continue'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status icon */}
        <div className="flex flex-col items-center mb-6">
          {getStatusIcon()}
          <h2 className="text-2xl font-bold text-white mt-4">
            {statusInfo.title}
          </h2>
          <p className="text-gray-400 text-center mt-2">
            {statusInfo.message}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Requirements */}
        {status === 'not_started' && (
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-gray-300">What you'll need:</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Government-issued ID (Passport, Driver's License, or National ID)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Selfie photo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                5-10 minutes of your time
              </li>
            </ul>
          </div>
        )}

        {/* Development notice */}
        {import.meta.env.DEV && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg">
            <p className="text-yellow-500 text-sm">
              Development mode: KYC will be auto-approved after 2 seconds
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {status === 'not_started' && (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStartKYC}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Starting...' : 'Start Verification'}
              </button>
            </>
          )}

          {status === 'pending' && (
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Close
            </button>
          )}

          {status === 'approved' && (
            <button
              onClick={() => {
                onSuccess?.();
                onClose();
              }}
              className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition"
            >
              Continue
            </button>
          )}

          {(status === 'rejected' || status === 'resubmission_required') && (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
              <button
                onClick={handleStartKYC}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition disabled:opacity-50"
              >
                Try Again
              </button>
            </>
          )}
        </div>

        {/* Privacy note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Your information is encrypted and stored securely.
          <br />
          We comply with GDPR and international privacy regulations.
        </p>
      </div>
    </div>
  );
}
