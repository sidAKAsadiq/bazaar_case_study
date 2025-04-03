import rateLimit from "express-rate-limit";

// for now I am considering 100 requests per 10 minutes
const default_limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, 
  message: {
    statusCode: 429,
    message: "Too many requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});
 
// we can also create custom limiters for specific routes for example this auth limiter is specific to login as it is relatively a more senstive end point so we only allow 10 requests in 10 mins instead of 100 requests
const auth_limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 10,
    message: {
      statusCode: 429,
      message: "Too many login attempts. Please wait 10 minutes."
    }
  });

export { default_limiter, auth_limiter };
