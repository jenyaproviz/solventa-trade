import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig, buildPublicUserIdentity, getPublicAdminIdentity, type AuthUser } from '../config/auth.js';
import { createRegisteredUser, findRegisteredUserByEmail } from '../data/authStore.js';
import { requireAuth } from '../middleware/requireAuth.js';

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

    return res.status(201).json({
      token,
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

    return res.json({
      token,
      admin
    });
  }

  const account = await findRegisteredUserByEmail(normalizedEmail);

  if (!account || account.password !== normalizedPassword) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const user = buildPublicUserIdentity({
    email: account.email,
    displayName: account.displayName,
  });
  const token = issueToken(user);

  return res.json({
    token,
    admin: user
  });
});

authRouter.get('/me', requireAuth, (req, res) => {
  return res.json({
    authenticated: true,
    admin: req.user
  });
});