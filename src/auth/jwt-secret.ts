import 'dotenv/config';

/**
 * JWT signing secret. Loaded here (not via ConfigModule) because decorators such as
 * JwtModule.register() run at import time, before ConfigModule has read .env.
 * Production refuses to start without one; dev falls back to a throwaway value.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set (16+ characters) in production');
  }
  return 'dev-only-secret-not-for-production';
}
