import { Rocket, Clock, Code, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ComingSoonProps {
  title: string;
  description: string;
  features?: string[];
  expectedDate?: string;
  iconComponent?: React.ComponentType<{ className?: string }>;
}

export default function ComingSoon({
  title,
  description,
  features = [],
  expectedDate,
  iconComponent: Icon = Rocket,
}: ComingSoonProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-primary">
      <div className="max-w-4xl w-full">
        {/* Back Button */}
        <Link
          to="/app/dashboard"
          className="inline-flex items-center gap-2 text-tertiary-text hover:text-gold-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Main Content */}
        <div className="bg-secondary backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-secondary shadow-2xl">
          {/* Icon & Badge */}
          <div className="flex flex-col items-center text-center mb-8">
            {/* Animated Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-amber-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-gold-500 to-amber-600 p-8 rounded-full shadow-xl">
                <Icon className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-400 text-sm font-semibold mb-4">
              <Clock className="w-4 h-4" />
              <span>Coming Soon</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gold-400 via-amber-300 to-gold-400 bg-clip-text text-transparent">
              {title}
            </h1>

            {/* Description */}
            <p className="text-xl text-secondary-text max-w-2xl">
              {description}
            </p>
          </div>

          {/* Features Section */}
          {features.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <h2 className="text-2xl font-bold text-primary-text">Upcoming Features</h2>
                <Sparkles className="w-5 h-5 text-gold-400" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-tertiary rounded-xl border border-secondary hover:border-gold-500/50 transition-all hover:shadow-lg hover:shadow-gold-500/10"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gold-500 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-secondary-text pt-1">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expected Date */}
          {expectedDate && (
            <div className="flex items-center justify-center gap-3 p-4 bg-blue-500/10 border border-blue-500/50 rounded-xl mb-8">
              <Clock className="w-5 h-5 text-blue-400" />
              <p className="text-blue-400 dark:text-blue-300 font-semibold">
                Expected Launch: {expectedDate}
              </p>
            </div>
          )}

          {/* Development Status */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-purple-500/20 rounded-xl">
                <Code className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary-text mb-2">Currently in Development</h3>
                <p className="text-secondary-text leading-relaxed">
                  Our team is working hard to bring you this feature. We're focused on creating the best possible
                  experience with robust functionality, beautiful design, and bulletproof security.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-gold-500/50 hover:scale-105 text-center"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/roadmap"
              className="px-8 py-4 bg-tertiary hover:bg-secondary text-primary-text font-bold rounded-xl transition-all border border-secondary hover:border-gold-500/50 text-center"
            >
              View Roadmap
            </Link>
          </div>

          {/* Subscribe for Updates (Optional) */}
          <div className="mt-8 text-center">
            <p className="text-tertiary-text text-sm">
              Want to be notified when this feature launches?{' '}
              <Link to="/app/settings" className="text-gold-400 hover:text-gold-300 font-semibold underline">
                Enable notifications in Settings
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
