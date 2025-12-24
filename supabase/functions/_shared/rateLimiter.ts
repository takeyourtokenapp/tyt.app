/**
 * Rate Limiting Middleware for Edge Functions
 *
 * Prevents abuse by limiting requests per IP address
 * Uses in-memory storage with TTL for lightweight implementation
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export function createRateLimiter(config: RateLimitConfig) {
  return async function rateLimit(req: Request): Promise<Response | null> {
    const clientIp = req.headers.get('x-forwarded-for') ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    const key = `${clientIp}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || entry.resetAt < now) {
      // Create new entry
      entry = {
        count: 1,
        resetAt: now + config.windowMs
      };
      rateLimitStore.set(key, entry);
      return null; // Allow request
    }

    if (entry.count >= config.maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

      return new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetAt.toString()
          }
        }
      );
    }

    // Increment counter
    entry.count++;

    return null; // Allow request
  };
}

// Predefined rate limiters for different use cases
export const rateLimiters = {
  // Strict: 10 requests per minute
  strict: createRateLimiter({
    maxRequests: 10,
    windowMs: 60000
  }),

  // Standard: 60 requests per minute
  standard: createRateLimiter({
    maxRequests: 60,
    windowMs: 60000
  }),

  // Lenient: 100 requests per minute
  lenient: createRateLimiter({
    maxRequests: 100,
    windowMs: 60000
  }),

  // Very strict (for sensitive operations): 5 requests per minute
  veryStrict: createRateLimiter({
    maxRequests: 5,
    windowMs: 60000
  })
};

/**
 * Helper function to add rate limiting headers to response
 */
export function addRateLimitHeaders(
  response: Response,
  config: RateLimitConfig,
  remaining: number,
  resetAt: number
): Response {
  const headers = new Headers(response.headers);
  headers.set('X-RateLimit-Limit', config.maxRequests.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', resetAt.toString());

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

/**
 * Example usage:
 *
 * import { rateLimiters } from '../_shared/rateLimiter.ts';
 *
 * Deno.serve(async (req: Request) => {
 *   const rateLimitResponse = await rateLimiters.standard(req);
 *   if (rateLimitResponse) return rateLimitResponse;
 *
 *   // Your function logic here...
 * });
 */
