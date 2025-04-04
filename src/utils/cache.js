import redisClient from "../db/v3/redis.js";

// Generic: get from cache
const getFromCache = async (key) => {
  const cached = await redisClient.get(key);
  return cached ? JSON.parse(cached) : null;
};

// Generic: set in cache with optional expiry
const setToCache = async (key, data, ttlInSeconds = 60) => {
  await redisClient.set(key, JSON.stringify(data), { EX: ttlInSeconds });
};

// Generic: invalidate cache key
const invalidateCache = async (key) => {
  await redisClient.del(key);
};

export { getFromCache, setToCache, invalidateCache };
