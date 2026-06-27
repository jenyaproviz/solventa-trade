export type AuthRole = 'admin' | 'user';

export type AuthUser = {
  email: string;
  displayName: string;
  role: AuthRole;
};

function requireEnv(name: 'JWT_SECRET' | 'ADMIN_EMAIL' | 'ADMIN_PASSWORD') {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`[config] Missing required environment variable: ${name}`);
  }

  return value;
}

export const authConfig = {
  jwtSecret: requireEnv('JWT_SECRET'),
  adminEmail: requireEnv('ADMIN_EMAIL'),
  adminPassword: requireEnv('ADMIN_PASSWORD'),
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