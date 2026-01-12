import { createClient } from 'jsr:@supabase/supabase-js@2';

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
  aud: string;
}

export interface AuthContext {
  user: AuthUser;
  supabase: ReturnType<typeof createClient>;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function verifyAuth(req: Request): Promise<AuthUser> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    throw new AuthError('Missing Authorization header', 401);
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new AuthError('Invalid Authorization header format. Expected: Bearer <token>', 401);
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token || token.length < 10) {
    throw new AuthError('Invalid token format', 401);
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      throw new AuthError(`Authentication failed: ${error.message}`, 401);
    }

    if (!user) {
      throw new AuthError('User not found or token expired', 401);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      aud: user.aud || 'authenticated'
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Failed to verify authentication token', 401);
  }
}

export async function requireAuth(req: Request): Promise<AuthContext> {
  const user = await verifyAuth(req);

  const userSupabase = createClient(
    supabaseUrl,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')!
        }
      }
    }
  );

  return {
    user,
    supabase: userSupabase
  };
}

export async function optionalAuth(req: Request): Promise<AuthContext | null> {
  try {
    return await requireAuth(req);
  } catch {
    return null;
  }
}

export async function requireAdmin(req: Request): Promise<AuthContext> {
  const context = await requireAuth(req);

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', context.user.id)
    .single();

  if (error || !profile?.is_admin) {
    throw new AuthError('Admin access required', 403);
  }

  return context;
}

export function createAuthErrorResponse(error: AuthError | Error): Response {
  const statusCode = error instanceof AuthError ? error.statusCode : 500;
  const message = error instanceof AuthError
    ? error.message
    : 'Internal server error';

  return new Response(
    JSON.stringify({
      error: error.name || 'AuthenticationError',
      message,
      statusCode
    }),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

export function createCorsHeaders(origin?: string): Record<string, string> {
  const allowedOrigins = [
    'https://takeyourtoken.app',
    'https://www.takeyourtoken.app',
    'https://tyt.foundation',
    'http://localhost:5173',
    'http://localhost:3000'
  ];

  const corsOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : '*';

  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
    'Access-Control-Max-Age': '86400'
  };
}

export function handleCorsPreflightRequest(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.get('origin');
    return new Response(null, {
      status: 204,
      headers: createCorsHeaders(origin)
    });
  }
  return null;
}
