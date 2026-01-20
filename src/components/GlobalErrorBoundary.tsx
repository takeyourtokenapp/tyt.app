import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleTryAgain = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorCount } = this.state;
      const isDev = import.meta.env.DEV;

      if (errorCount > 5) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Critical Error
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                The application has encountered multiple errors ({errorCount} times).
                Please reload the page or contact support if the problem persists.
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={this.handleReload}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reload Application
                </button>

                <a
                  href="mailto:support@takeyourtoken.app"
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Something Went Wrong
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 text-center">
              We apologize for the inconvenience. The application encountered an unexpected error.
            </p>

            {isDev && error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                  Error Details (Development Mode):
                </p>
                <pre className="text-xs text-red-700 dark:text-red-400 overflow-x-auto whitespace-pre-wrap break-words">
                  {error.toString()}
                </pre>
                {error.stack && (
                  <pre className="text-xs text-red-600 dark:text-red-500 mt-2 overflow-x-auto whitespace-pre-wrap break-words">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={this.handleTryAgain}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go Home
              </button>

              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Reload Page
              </button>
            </div>

            {errorCount > 1 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
                This error has occurred {errorCount} times. If it continues, please contact support.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
