import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig, type AuthRole, type AuthUser } from '../config/auth.js';

type AuthRequest = Request & {
  user?: AuthUser;
};

function authenticateRequest(req: AuthRequest, res: Response, next: NextFunction) {
  const authorization = req.header('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing authorization token.' });
  }

  const token = authorization.slice('Bearer '.length);

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret, {
      issuer: authConfig.issuer,
      audience: authConfig.audience,
    });

    if (typeof decoded !== 'object' || decoded === null || !('email' in decoded)) {
      return res.status(401).json({ message: 'Invalid authorization token.' });
    }

    const role = String((decoded as { role?: unknown }).role ?? 'admin');
    const safeRole: AuthRole = role === 'user' ? 'user' : 'admin';

    req.user = {
      email: String((decoded as { email?: unknown }).email ?? authConfig.adminEmail),
      displayName: String((decoded as { displayName?: unknown }).displayName ?? 'Solventa Admin'),
      role: safeRole,
    };

    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authorization token.' });
  }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  return authenticateRequest(req, res, next);
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  return authenticateRequest(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    return next();
  });
}