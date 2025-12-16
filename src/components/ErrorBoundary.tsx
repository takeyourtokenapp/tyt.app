import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
                  <p className="text-gray-400 text-sm">An unexpected error occurred</p>
                </div>
              </div>

              <div className="bg-black/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-300 font-mono break-words">
                  {this.state.error?.message || 'Unknown error'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
