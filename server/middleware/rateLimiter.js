import rateLimit from "express-rate-limit";

// Stricter limit for auth routes (prevents brute-force login attempts)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per window
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General limiter for the rest of the API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // more generous, since browsing/searching is normal frequent activity
  message: { message: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});