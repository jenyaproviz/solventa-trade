import { env } from './env.js';

export type AuthRole = 'admin' | 'user';

export type AuthUser = {
  email: string;
  displayName: string;
  role: AuthRole;
};

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET ?? 'dev-only-secret-change-me',
  adminEmail: process.env.ADMIN_EMAIL ?? 'solventatrade@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'Solventa2026',
  tokenExpiresIn: '8h' as const,
  issuer: 'solventa-backend',
  audience: 'solventa-admin'
};

export function getPublicAdminIdentity(): AuthUser {
  return {
    email: authConfig.adminEmail,
    displayName: 'Solventa Admin',
    role: 'admin'
  };
}

export function buildPublicUserIdentity(payload: { email: string; displayName: string }): AuthUser {
  return {
    email: payload.email,
    displayName: payload.displayName,
    role: 'user'
  };
}