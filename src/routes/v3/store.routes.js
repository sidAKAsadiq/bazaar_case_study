import { Router } from "express";
import {
  create_store,
  get_all_stores,
  get_store_by_id,
  update_store,
  delete_store
} from "../../controllers/v3/store.controller.js";

import { verify_jwt } from "../../middlewares/auth.middleware.js";
import {authorize_roles} from "../../middlewares/authorize_roles.middleware.js"



const router = Router();

router.post("/create_store", verify_jwt, authorize_roles("admin"), create_store);
router.get("/get_all_stores", verify_jwt, authorize_roles("admin"), get_all_stores);
router.get("/get_store/:id", verify_jwt, authorize_roles("admin"), get_store_by_id);
router.put("/update_store/:id", verify_jwt, authorize_roles("admin"), update_store);
router.delete("/delete_store/:id", verify_jwt, authorize_roles("admin"), delete_store);


export default router;
