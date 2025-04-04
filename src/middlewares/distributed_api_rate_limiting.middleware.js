import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../db/v3/redis.js"; // your existing Redis client



// Default limiter: 100 requests per 10 minutes per IP
const default_limiter_v3 = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100,
  message: {
    statusCode: 429,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    prefix: "rl:default:", 
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

// Login/Auth limiter: 10 attempts per 10 minutes
const auth_limiter_v3 = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 10,
  message: {
    statusCode: 429,
    message: "Too many login attempts. Please wait 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    prefix: "rl:auth:", 
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

export { default_limiter_v3, auth_limiter_v3 };
