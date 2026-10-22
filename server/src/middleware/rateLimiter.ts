import rateLimit from 'express-rate-limit';

export const voteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 votes per IP in 15 min
  message: { error: 'Too many voting requests. Please wait a few minutes before trying again.' }
});

export const commentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  message: { error: 'Too many comments posted. Please wait a moment.' }
});

export const guestbookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many postcards submitted. Please pause before sending another.' }
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Please wait before trying again.' }
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many upload requests. Please wait before trying again.' }
});
