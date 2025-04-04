import { Router } from "express";
import {
  create_supplier,
  get_all_suppliers,
  get_supplier_by_id,
  update_supplier,
  delete_supplier
} from "../../controllers/v3/supplier.controller.js";

import { verify_jwt } from "../../middlewares/auth.middleware.js";
import {authorize_roles} from "../../middlewares/authorize_roles.middleware.js"



const router = Router();

router.post("/create_supplier", verify_jwt, authorize_roles("admin", "store_manager"), create_supplier);
router.get("/get_all_suppliers", verify_jwt, get_all_suppliers); // Can be public if needed
router.get("/get_supplier/:id", verify_jwt, get_supplier_by_id);
router.put("/update_supplier/:id", verify_jwt, authorize_roles("admin", "store_manager"), update_supplier);
router.delete("/delete_supplier/:id", verify_jwt, authorize_roles("admin", "store_manager"), delete_supplier);


export default router;
