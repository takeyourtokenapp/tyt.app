import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  componentName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { componentName, onError } = this.props;

    console.error(
      `Component Error Boundary (${componentName || 'Unknown'}) caught an error:`,
      error,
      errorInfo
    );

    if (onError) {
      onError(error, errorInfo);
    }

    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          component: componentName || 'unknown',
          errorBoundary: 'ComponentErrorBoundary',
        },
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      const { componentName } = this.props;
      const { error } = this.state;
      const isDev = import.meta.env.DEV;

      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-1">
                {componentName || 'Component'} Error
              </h3>

              <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                This component failed to render. You can try reloading it or continue using other
                parts of the application.
              </p>

              {isDev && error && (
                <pre className="text-xs text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-900/20 p-3 rounded overflow-x-auto mb-4">
                  {error.toString()}
                </pre>
              )}

              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const WrappedComponent = (props: P) => (
    <ComponentErrorBoundary componentName={componentName || Component.displayName || Component.name}>
      <Component {...props} />
    </ComponentErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${componentName || Component.displayName || Component.name})`;

  return WrappedComponent;
};
