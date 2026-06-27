import type { NextFunction, Request, Response } from 'express';
import { CSRF_COOKIE_NAME } from '../config/cookies.js';

export function requireCsrf(req: Request, res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.header('x-csrf-token');

  if (
    typeof cookieToken !== 'string' ||
    cookieToken === '' ||
    typeof headerToken !== 'string' ||
    headerToken === '' ||
    cookieToken !== headerToken
  ) {
    return res.status(403).json({ message: 'Invalid CSRF token.' });
  }

  return next();
}