import { env } from './env.js';

export const AUTH_COOKIE_NAME = 'solventa_auth_token';
export const CSRF_COOKIE_NAME = 'solventa_csrf_token';

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  };
}

export function getCsrfCookieOptions() {
  return {
    httpOnly: false,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  };
}