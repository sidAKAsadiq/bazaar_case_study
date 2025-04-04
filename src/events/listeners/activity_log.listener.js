import event_bus from "../event_bus.js";
import { ActivityLog } from "../../models/v3/activity_log.models.js";

event_bus.on("activity", async ({ user_id, action, model, model_id , metadata = {} }) => {
  try {
    if (!user_id || !action || !model || !model_id) return;

    await ActivityLog.create({
      user_id,
      action,
      model,
      model_id,
      metadata
    });

    console.log(` Activity log written for ${action} on ${model}`);
  } catch (error) {
    console.error(" Failed to write activity log:", error.message);
  }
});
