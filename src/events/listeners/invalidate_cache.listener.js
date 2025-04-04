import event_bus from "../event_bus.js";
import { invalidateCache } from "../../utils/cache.js";

event_bus.on("cache:invalidate", async ({ key }) => {
  try {
    if (!key) return;
    await invalidateCache(key);
    console.log(` Cache invalidated: ${key}`);
  } catch (error) {
    console.error("Cache invalidation failed:", error.message);
  }
});
