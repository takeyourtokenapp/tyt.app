/**
 * Security Utilities
 *
 * Comprehensive security helpers for input validation,
 * sanitization, and protection against common attacks.
 */

/**
 * Validate and sanitize string input
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  let sanitized = input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers

  return sanitized;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._+-])*[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9-])*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length >= 5 && email.length <= 254;
}

/**
 * Validate Ethereum address
 */
export function validateEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate Solana address
 */
export function validateSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Validate Bitcoin address
 */
export function validateBitcoinAddress(address: string): boolean {
  return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address);
}

/**
 * Validate amount (positive number)
 */
export function validateAmount(amount: number, min: number = 0, max: number = Infinity): boolean {
  return typeof amount === 'number' &&
         !isNaN(amount) &&
         amount >= min &&
         amount <= max &&
         amount > 0;
}

/**
 * Rate limiter for client-side
 */
export class ClientRateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}

  check(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Remove old requests
    const validRequests = requests.filter(time => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

/**
 * Sanitize object for API requests
 * Removes undefined, null, and empty strings
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}

/**
 * Check if running in secure context
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return true;
  return window.isSecureContext;
}

/**
 * Validate URL
 */
export function validateURL(url: string, allowedProtocols: string[] = ['https:', 'http:']): boolean {
  try {
    const parsed = new URL(url);
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Generate secure random string using Web Crypto API
 */
export function generateSecureToken(length: number = 32): string {
  if (typeof window === 'undefined' || !window.crypto?.getRandomValues) {
    throw new Error('Web Crypto API is not available. Secure random generation requires a secure context (HTTPS).');
  }

  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate secure random ID (shorter, URL-safe)
 */
export function generateSecureId(length: number = 16): string {
  if (typeof window === 'undefined' || !window.crypto?.getRandomValues) {
    throw new Error('Web Crypto API is not available. Secure random generation requires a secure context (HTTPS).');
  }

  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(36)).join('').substring(0, length);
}

/**
 * Hash sensitive data (client-side)
 */
export async function hashData(data: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error('Web Crypto API not available');
  }

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate JWT token format (basic check)
 */
export function validateJWTFormat(token: string): boolean {
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
}

/**
 * Check password strength
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
  isStrong: boolean;
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters');
  } else {
    score += 1;
  }

  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
  if (!/[0-9]/.test(password)) feedback.push('Add numbers');
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add special characters');

  return {
    score,
    feedback,
    isStrong: score >= 4
  };
}

/**
 * Prevent XSS by escaping HTML
 */
export function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Content Security Policy generator
 * Note: For production, use nonce-based CSP instead of 'unsafe-inline'
 */
export function generateCSP(nonce?: string): string {
  const scriptSrc = nonce
    ? `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net`
    : "script-src 'self' https://cdn.jsdelivr.net";

  const styleSrc = nonce
    ? `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`
    : "style-src 'self' https://fonts.googleapis.com";

  return [
    "default-src 'self'",
    scriptSrc,
    styleSrc,
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.alchemy.com https://*.infura.io",
    "frame-src 'self' https://ramp.network",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
}

/**
 * Validate transaction signature
 */
export function validateTransactionData(tx: any): boolean {
  if (!tx || typeof tx !== 'object') return false;

  const required = ['from', 'to', 'value'];
  return required.every(field => field in tx);
}

/**
 * Secure storage wrapper
 */
export class SecureStorage {
  private prefix = 'tyt_secure_';

  set(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.error('SecureStorage.set error:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('SecureStorage.get error:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const secureStorage = new SecureStorage();
