import { ActivityLog } from "../models/v3/activity_log.models.js";
import { api_error } from "./api_error.js"

const log_activity = async ({ user_id, action, model, model_id, metadata = {} }) => {
  try {
    await ActivityLog.create({
      user_id,
      action,
      model,
      model_id,
      metadata
    });
  } catch (error) {
    throw new api_error(500, `Unable to log the activity : ${error}`)
  }
};

export { log_activity };
