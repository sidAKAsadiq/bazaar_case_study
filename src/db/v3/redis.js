import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("❌ Redis client error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected (client ready)");
});

await redisClient.connect(); // Top-level await since Node 14+

export default redisClient;
