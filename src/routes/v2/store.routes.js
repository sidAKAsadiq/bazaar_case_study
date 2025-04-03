import { Router } from "express";
import {
  create_store,
  get_all_stores,
  get_store_by_id,
  update_store,
  delete_store
} from "../../controllers/v2/store.controller.js";

import { verify_jwt } from "../../middlewares/auth.middleware.js";

const router = Router();

// Store Routes - REST format
router.post("/create_store", verify_jwt, create_store);
router.get("/get_all_stores", verify_jwt, get_all_stores);
router.get("/get_store/:id", verify_jwt, get_store_by_id);
router.put("/update_store/:id", verify_jwt, update_store);
router.delete("/delete_store/:id", verify_jwt, delete_store);

export default router;
