import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { authConfig, buildPublicUserIdentity, getPublicAdminIdentity, type AuthUser } from '../config/auth.js';
import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME, getAuthCookieOptions, getCsrfCookieOptions } from '../config/cookies.js';
import { createRegisteredUser, verifyRegisteredUserPassword } from '../data/authStore.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireCsrf } from '../middleware/requireCsrf.js';

export const authRouter = Router();

function issueToken(user: AuthUser) {
  return jwt.sign(
    {
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
    authConfig.jwtSecret,
    {
      expiresIn: authConfig.tokenExpiresIn,
      issuer: authConfig.issuer,
      audience: authConfig.audience
    }
  );
}

function setSessionCookies(res: Response, token: string) {
  const csrfToken = randomBytes(24).toString('hex');
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
  res.cookie(CSRF_COOKIE_NAME, csrfToken, getCsrfCookieOptions());
}

function clearSessionCookies(res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: getAuthCookieOptions().secure,
    sameSite: getAuthCookieOptions().sameSite,
    path: '/',
  });
  res.clearCookie(CSRF_COOKIE_NAME, {
    httpOnly: false,
    secure: getCsrfCookieOptions().secure,
    sameSite: getCsrfCookieOptions().sameSite,
    path: '/',
  });
}

function normalizeDisplayName(email: string, displayName?: string) {
  const clean = (displayName ?? '').trim();
  if (clean !== '') return clean;
  const fromEmail = email.split('@')[0] ?? 'User';
  return fromEmail.charAt(0).toUpperCase() + fromEmail.slice(1);
}

authRouter.post('/signup', async (req, res) => {
  const { email, password, displayName } = req.body as {
    email?: unknown;
    password?: unknown;
    displayName?: unknown;
  };

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  if (normalizedPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  if (normalizedEmail === authConfig.adminEmail.trim().toLowerCase()) {
    return res.status(409).json({ message: 'This email is reserved for admin login.' });
  }

  try {
    const created = await createRegisteredUser({
      email: normalizedEmail,
      password: normalizedPassword,
      displayName: normalizeDisplayName(
        normalizedEmail,
        typeof displayName === 'string' ? displayName : undefined
      )
    });

    const user = buildPublicUserIdentity({
      email: created.email,
      displayName: created.displayName,
    });

    const token = issueToken(user);
    setSessionCookies(res, token);

    return res.status(201).json({
      admin: user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create account.';
    return res.status(409).json({ message });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: unknown; password?: unknown };

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (
    normalizedEmail === authConfig.adminEmail.trim().toLowerCase() &&
    normalizedPassword === authConfig.adminPassword
  ) {
    const admin = getPublicAdminIdentity();
    const token = issueToken(admin);
    setSessionCookies(res, token);

    return res.json({
      admin
    });
  }

  const account = await verifyRegisteredUserPassword(normalizedEmail, normalizedPassword);

  if (!account) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const user = buildPublicUserIdentity({
    email: account.email,
    displayName: account.displayName,
  });
  const token = issueToken(user);
  setSessionCookies(res, token);

  return res.json({
    admin: user
  });
});

authRouter.get('/me', requireAuth, (req, res) => {
  return res.json({
    authenticated: true,
    admin: req.user
  });
});

authRouter.post('/logout', requireAuth, requireCsrf, (_req, res) => {
  clearSessionCookies(res);
  return res.json({ ok: true });
});