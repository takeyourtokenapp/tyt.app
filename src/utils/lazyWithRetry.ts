import React, { ComponentType, lazy } from 'react';

interface LazyImport {
  default: ComponentType<any>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<LazyImport>,
  componentName: string = 'Component'
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: Error | undefined;

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const component = await componentImport();
        return component;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Failed to load ${componentName}, attempt ${i + 1}/${MAX_RETRIES}`, error);

        if (i < MAX_RETRIES - 1) {
          await wait(RETRY_DELAY * (i + 1));
        }
      }
    }

    console.error(`Failed to load ${componentName} after ${MAX_RETRIES} attempts. Forcing page reload.`);

    const ErrorComponent: React.FC = () => {
      React.useEffect(() => {
        const timer = setTimeout(() => {
          window.location.reload();
        }, 2000);
        return () => clearTimeout(timer);
      }, []);

      return React.createElement(
        'div',
        { className: 'min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center' },
        React.createElement(
          'div',
          { className: 'max-w-md text-center space-y-4 p-8' },
          React.createElement('div', { className: 'text-red-500 text-6xl mb-4' }, '⚠️'),
          React.createElement('h2', { className: 'text-2xl font-bold' }, 'Failed to Load Page'),
          React.createElement('p', { className: 'text-gray-400' }, `Unable to load ${componentName}. The page will reload automatically.`),
          React.createElement('div', { className: 'text-sm text-gray-500 mt-4' }, 'If the problem persists, please clear your browser cache.'),
          React.createElement(
            'button',
            {
              onClick: () => window.location.reload(),
              className: 'mt-6 px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors'
            },
            'Reload Now'
          )
        )
      );
    };

    return {
      default: ErrorComponent as any,
    };
  });
}
