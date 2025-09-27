import rateLimit from 'express-rate-limit';

export const createRateLimiter = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message || 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiter
export const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

// Strict rate limiter for LLM endpoints
export const llmLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // limit each IP to 10 LLM requests per minute
  'Too many LLM requests, please try again later.'
);

// File upload rate limiter
export const uploadLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  5, // limit each IP to 5 uploads per minute
  'Too many file uploads, please try again later.'
);