import { NextFunction, Request, Response } from 'express';

declare module 'express-session' {
  interface SessionData {
    isMemoryStudioAdmin?: boolean;
    csrfToken?: string;
    authVersion?: string;
  }
}

const sessionVersion = () => process.env.ADMIN_SESSION_VERSION || '1';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session?.isMemoryStudioAdmin && req.session.authVersion === sessionVersion()) return next();
  res.status(401).json({ error: 'Administrator authentication is required.' });
};

// The cookie is HttpOnly, so state-changing requests must also present the
// per-session token that was returned after an authenticated unlock.
export const requireCsrf = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.get('x-csrf-token');
  if (token && req.session?.csrfToken && token === req.session.csrfToken) return next();
  res.status(403).json({ error: 'Your session security token is missing or expired.' });
};
