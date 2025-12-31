import { supabase } from './supabase';

const FOUNDATION_DOMAIN = import.meta.env.VITE_FOUNDATION_DOMAIN || 'https://tyt.foundation';
const APP_DOMAIN = import.meta.env.VITE_APP_DOMAIN || 'https://takeyourtoken.app';

export interface CrossDomainNavOptions {
  preserveAuth?: boolean;
  openInNewTab?: boolean;
  params?: Record<string, string>;
}

export async function navigateToFoundation(
  path: string,
  options: CrossDomainNavOptions = {}
) {
  const { preserveAuth = true, openInNewTab = false, params = {} } = options;

  const url = new URL(`${FOUNDATION_DOMAIN}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  if (preserveAuth) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        url.searchParams.set('token', session.access_token);
      }
    } catch (error) {
      console.error('Failed to get session for cross-domain nav:', error);
    }
  }

  url.searchParams.set('source', 'takeyourtoken.app');

  if (openInNewTab) {
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url.toString();
  }
}

export async function navigateToApp(
  path: string,
  options: CrossDomainNavOptions = {}
) {
  const { preserveAuth = true, openInNewTab = false, params = {} } = options;

  const url = new URL(`${APP_DOMAIN}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  if (preserveAuth) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        url.searchParams.set('token', session.access_token);
      }
    } catch (error) {
      console.error('Failed to get session for cross-domain nav:', error);
    }
  }

  url.searchParams.set('source', 'tyt.foundation');

  if (openInNewTab) {
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url.toString();
  }
}

export const foundationLinks = {
  home: (options?: CrossDomainNavOptions) => navigateToFoundation('/', options),
  about: (options?: CrossDomainNavOptions) => navigateToFoundation('/about', options),
  aoi: (options?: CrossDomainNavOptions) => navigateToFoundation('/aoi', options),
  donate: (options?: CrossDomainNavOptions) => navigateToFoundation('/donate', { ...options, preserveAuth: true }),
  research: (options?: CrossDomainNavOptions) => navigateToFoundation('/research', options),
  grants: (options?: CrossDomainNavOptions) => navigateToFoundation('/grants', options),
  transparency: (options?: CrossDomainNavOptions) => navigateToFoundation('/transparency', options),
  contact: (options?: CrossDomainNavOptions) => navigateToFoundation('/contact', options),
  partners: (options?: CrossDomainNavOptions) => navigateToFoundation('/partners', options),
  impact: (options?: CrossDomainNavOptions) => navigateToFoundation('/impact', options),
};

export const appLinks = {
  home: (options?: CrossDomainNavOptions) => navigateToApp('/', options),
  dashboard: (options?: CrossDomainNavOptions) => navigateToApp('/app', { ...options, preserveAuth: true }),
  academy: (options?: CrossDomainNavOptions) => navigateToApp('/app/academy', { ...options, preserveAuth: true }),
  marketplace: (options?: CrossDomainNavOptions) => navigateToApp('/app/marketplace', { ...options, preserveAuth: true }),
  miners: (options?: CrossDomainNavOptions) => navigateToApp('/app/miners', { ...options, preserveAuth: true }),
  wallet: (options?: CrossDomainNavOptions) => navigateToApp('/app/wallet', { ...options, preserveAuth: true }),
  foundation: (options?: CrossDomainNavOptions) => navigateToApp('/app/foundation', { ...options, preserveAuth: true }),
  signup: (options?: CrossDomainNavOptions) => navigateToApp('/signup', options),
  login: (options?: CrossDomainNavOptions) => navigateToApp('/login', options),
};

export function getFoundationUrl(path: string = ''): string {
  return `${FOUNDATION_DOMAIN}${path}`;
}

export function getAppUrl(path: string = ''): string {
  return `${APP_DOMAIN}${path}`;
}

export function isFoundationDomain(): boolean {
  return window.location.hostname.includes('tyt.foundation');
}

export function isAppDomain(): boolean {
  return window.location.hostname.includes('takeyourtoken.app') ||
         window.location.hostname.includes('localhost');
}
