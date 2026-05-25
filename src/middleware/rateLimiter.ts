import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.rateLimit.anonymous,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 429,
    status: 'Too Many Requests',
    method: 'GET',
    cause: 'You have exhausted your API request quota',
    message: 'See more on: /docs/guides/rate-limiting',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: config.rateLimit.authHours * 60 * 60 * 1000,
  max: config.rateLimit.auth,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 429,
    status: 'Too Many Requests',
    method: 'GET',
    cause: 'You have exhausted your API request quota',
    message: 'See more on: /docs/guides/rate-limiting',
  },
});
