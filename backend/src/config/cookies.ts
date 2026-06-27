import { env } from './env.js';

export const AUTH_COOKIE_NAME = 'solventa_auth_token';
export const CSRF_COOKIE_NAME = 'solventa_csrf_token';

const isProduction = env.nodeEnv === 'production';

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  };
}

export function getCsrfCookieOptions() {
  return {
    httpOnly: false,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  };
}