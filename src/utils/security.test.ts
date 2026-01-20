import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  sanitizeString,
  validateEmail,
  validateEthAddress,
  validateSolanaAddress,
  validateBitcoinAddress,
  validateAmount,
  ClientRateLimiter,
  sanitizeObject,
  validateURL,
  validateJWTFormat,
  checkPasswordStrength,
  validateTransactionData,
  SecureStorage,
} from './security';

describe('Security Utilities', () => {
  describe('sanitizeString', () => {
    it('should remove < and > characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('should remove javascript: protocol', () => {
      expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)');
      expect(sanitizeString('JAVASCRIPT:alert(1)')).toBe('alert(1)');
    });

    it('should remove event handlers', () => {
      expect(sanitizeString('text onclick=alert(1)')).toBe('text alert(1)');
      expect(sanitizeString('text ONLOAD=alert(1)')).toBe('text alert(1)');
    });

    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('should limit length', () => {
      const longString = 'a'.repeat(2000);
      expect(sanitizeString(longString, 100)).toHaveLength(100);
    });

    it('should throw error for non-string input', () => {
      expect(() => sanitizeString(123 as any)).toThrow('Input must be a string');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user1@example.com')).toBe(true);
      expect(validateEmail('test@test.io')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('should enforce length constraints', () => {
      expect(validateEmail('a@b.c')).toBe(false);
      expect(validateEmail('a'.repeat(250) + '@example.com')).toBe(false);
    });
  });

  describe('validateEthAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      expect(validateEthAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbf')).toBe(true);
      expect(validateEthAddress('0x0000000000000000000000000000000000000000')).toBe(true);
    });

    it('should reject invalid Ethereum addresses', () => {
      expect(validateEthAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bE')).toBe(false);
      expect(validateEthAddress('742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false);
      expect(validateEthAddress('0xGGGG35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false);
    });
  });

  describe('validateSolanaAddress', () => {
    it('should validate correct Solana addresses', () => {
      expect(validateSolanaAddress('DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK')).toBe(true);
    });

    it('should reject invalid Solana addresses', () => {
      expect(validateSolanaAddress('invalid')).toBe(false);
      expect(validateSolanaAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false);
    });
  });

  describe('validateBitcoinAddress', () => {
    it('should validate correct Bitcoin addresses', () => {
      expect(validateBitcoinAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBe(true);
      expect(validateBitcoinAddress('3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy')).toBe(true);
      expect(validateBitcoinAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBe(true);
    });

    it('should reject invalid Bitcoin addresses', () => {
      expect(validateBitcoinAddress('invalid')).toBe(false);
      expect(validateBitcoinAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false);
    });
  });

  describe('validateAmount', () => {
    it('should validate positive numbers', () => {
      expect(validateAmount(100)).toBe(true);
      expect(validateAmount(0.01)).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(validateAmount(0)).toBe(false);
      expect(validateAmount(-10)).toBe(false);
      expect(validateAmount(NaN)).toBe(false);
    });

    it('should respect min and max boundaries', () => {
      expect(validateAmount(50, 10, 100)).toBe(true);
      expect(validateAmount(5, 10, 100)).toBe(false);
      expect(validateAmount(150, 10, 100)).toBe(false);
    });
  });

  describe('ClientRateLimiter', () => {
    let limiter: ClientRateLimiter;

    beforeEach(() => {
      limiter = new ClientRateLimiter(3, 1000);
    });

    it('should allow requests within limit', () => {
      expect(limiter.check('user1')).toBe(true);
      expect(limiter.check('user1')).toBe(true);
      expect(limiter.check('user1')).toBe(true);
    });

    it('should block requests exceeding limit', () => {
      limiter.check('user1');
      limiter.check('user1');
      limiter.check('user1');
      expect(limiter.check('user1')).toBe(false);
    });

    it('should track different keys separately', () => {
      limiter.check('user1');
      limiter.check('user1');
      limiter.check('user1');
      expect(limiter.check('user2')).toBe(true);
    });

    it('should allow requests after window expires', async () => {
      limiter.check('user1');
      limiter.check('user1');
      limiter.check('user1');
      expect(limiter.check('user1')).toBe(false);

      await new Promise(resolve => setTimeout(resolve, 1100));
      expect(limiter.check('user1')).toBe(true);
    });

    it('should reset limit for specific key', () => {
      limiter.check('user1');
      limiter.check('user1');
      limiter.check('user1');
      expect(limiter.check('user1')).toBe(false);

      limiter.reset('user1');
      expect(limiter.check('user1')).toBe(true);
    });
  });

  describe('sanitizeObject', () => {
    it('should remove null and undefined values', () => {
      const input = {
        a: 'value',
        b: null,
        c: undefined,
        d: '',
      };
      const result = sanitizeObject(input);
      expect(result).toEqual({ a: 'value' });
    });

    it('should sanitize string values', () => {
      const input = {
        name: '<script>alert(1)</script>',
        description: 'Normal text',
      };
      const result = sanitizeObject(input);
      expect(result.name).toBe('scriptalert(1)/script');
      expect(result.description).toBe('Normal text');
    });

    it('should recursively sanitize nested objects', () => {
      const input = {
        user: {
          name: '<script>test</script>',
          email: null,
        },
      };
      const result = sanitizeObject(input);
      expect(result.user).toEqual({ name: 'scripttest/script' });
    });
  });

  describe('validateURL', () => {
    it('should validate correct URLs', () => {
      expect(validateURL('https://example.com')).toBe(true);
      expect(validateURL('http://example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateURL('not-a-url')).toBe(false);
      expect(validateURL('javascript:alert(1)')).toBe(false);
    });

    it('should enforce allowed protocols', () => {
      expect(validateURL('ftp://example.com', ['https:', 'http:'])).toBe(false);
      expect(validateURL('ftp://example.com', ['ftp:'])).toBe(true);
    });
  });

  describe('validateJWTFormat', () => {
    it('should validate correct JWT format', () => {
      expect(validateJWTFormat('header.payload.signature')).toBe(true);
    });

    it('should reject invalid JWT format', () => {
      expect(validateJWTFormat('invalid')).toBe(false);
      expect(validateJWTFormat('only.two')).toBe(false);
      expect(validateJWTFormat('header..signature')).toBe(false);
    });
  });

  describe('checkPasswordStrength', () => {
    it('should rate strong passwords highly', () => {
      const result = checkPasswordStrength('MyP@ssw0rd123!');
      expect(result.isStrong).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(4);
      expect(result.feedback).toHaveLength(0);
    });

    it('should identify weak passwords', () => {
      const result = checkPasswordStrength('weak');
      expect(result.isStrong).toBe(false);
      expect(result.score).toBeLessThan(4);
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should provide helpful feedback', () => {
      const result = checkPasswordStrength('lowercase');
      expect(result.feedback).toContain('Add uppercase letters');
      expect(result.feedback).toContain('Add numbers');
      expect(result.feedback).toContain('Add special characters');
    });

    it('should reward length', () => {
      const short = checkPasswordStrength('Aa1!');
      const long = checkPasswordStrength('Aa1!Aa1!Aa1!Aa1!');
      expect(long.score).toBeGreaterThan(short.score);
    });
  });

  describe('validateTransactionData', () => {
    it('should validate correct transaction data', () => {
      const tx = {
        from: '0x123...',
        to: '0x456...',
        value: '1000',
      };
      expect(validateTransactionData(tx)).toBe(true);
    });

    it('should reject incomplete transaction data', () => {
      expect(validateTransactionData({ from: '0x123...' })).toBe(false);
      expect(validateTransactionData(null)).toBe(false);
      expect(validateTransactionData('not-an-object')).toBe(false);
    });
  });

  describe('SecureStorage', () => {
    let storage: SecureStorage;

    beforeEach(() => {
      storage = new SecureStorage();
      localStorage.clear();
    });

    it('should store and retrieve values', () => {
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
    });

    it('should handle complex objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      storage.set('obj', obj);
      expect(storage.get('obj')).toEqual(obj);
    });

    it('should return null for missing keys', () => {
      expect(storage.get('nonexistent')).toBeNull();
    });

    it('should remove values', () => {
      storage.set('key', 'value');
      storage.remove('key');
      expect(storage.get('key')).toBeNull();
    });

    it('should clear all prefixed keys', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      localStorage.setItem('other', 'value');

      storage.clear();

      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
      expect(localStorage.getItem('other')).toBe('value');
    });
  });
});
