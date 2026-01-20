import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
    };
    return checks;
  };

  const checks = validatePassword(password);
  const isPasswordValid = Object.values(checks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet security requirements');
      return;
    }

    setLoading(true);
    console.log('Signup form submitted:', { email });

    try {
      const result = await signUp(email, password);
      console.log('Sign up successful:', result);
      setSuccess(true);
      // Don't redirect - show email verification message
    } catch (err) {
      console.error('Signup error details:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown',
        stack: err instanceof Error ? err.stack : undefined
      });

      let errorMessage = 'Failed to create account';

      if (err instanceof Error) {
        errorMessage = err.message;

        if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Check your connection and Supabase configuration.';
        } else if (err.message.includes('already registered') || err.message.includes('User already registered')) {
          errorMessage = 'This email is already registered. Try logging in.';
        } else if (err.message.includes('Database')) {
          errorMessage = 'Database error saving new user. Check Supabase Auth settings (disable email confirmation).';
        } else if (err.message.includes('Email')) {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-2xl">
              TYT
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join the TYT mining platform</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-6 bg-green-500/10 border border-green-500/50 rounded-lg">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-1">Account Created Successfully!</h3>
                  <p className="text-sm text-gray-300">One more step to get started...</p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-1">Verify Your Email</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      We've sent a verification link to <span className="font-medium text-white">{email}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Please check your inbox and click the verification link to activate your account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-400">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Check your spam folder if you don't see it
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  The link expires in 24 hours
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  You can't log in until you verify your email
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-green-500/30">
                <Link
                  to="/login"
                  className="text-sm text-green-400 hover:text-green-300 font-medium inline-flex items-center gap-2"
                >
                  After verification, go to login →
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Create a strong password"
              />

              {password && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-400 mb-2">Password must contain:</p>
                  <div className={`flex items-center gap-2 text-xs ${checks.length ? 'text-green-400' : 'text-gray-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${checks.length ? 'bg-green-400' : 'bg-gray-600'}`} />
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${checks.uppercase ? 'text-green-400' : 'text-gray-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${checks.uppercase ? 'bg-green-400' : 'bg-gray-600'}`} />
                    One uppercase letter (A-Z)
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${checks.lowercase ? 'text-green-400' : 'text-gray-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${checks.lowercase ? 'bg-green-400' : 'bg-gray-600'}`} />
                    One lowercase letter (a-z)
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${checks.number ? 'text-green-400' : 'text-gray-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${checks.number ? 'bg-green-400' : 'bg-gray-600'}`} />
                    One number (0-9)
                  </div>

                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-amber-400 mb-2">Create a Unique Password</p>
                    <p className="text-xs text-gray-400 mb-2">Your password must be unique and not found in data breach databases.</p>
                    <div className="space-y-1">
                      <p className="text-xs text-green-400">Good: MyTYT!Secure#2026@Mining</p>
                      <p className="text-xs text-red-400">Avoid: Password123! or Bitcoin2024!</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Tip: Add personal info or random symbols to make it unique</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Re-enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success || !isPasswordValid}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-300">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
