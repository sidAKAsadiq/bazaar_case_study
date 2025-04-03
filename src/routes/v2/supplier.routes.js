import { Router } from "express";
import {
  create_supplier,
  get_all_suppliers,
  get_supplier_by_id,
  update_supplier,
  delete_supplier
} from "../../controllers/v2/supplier.controller.js";

import { verify_jwt } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/create_supplier", verify_jwt, create_supplier);
router.get("/get_all_suppliers", verify_jwt, get_all_suppliers);
router.get("/get_supplier/:id", verify_jwt, get_supplier_by_id);
router.put("/update_supplier/:id", verify_jwt, update_supplier);
router.delete("/delete_supplier/:id", verify_jwt, delete_supplier);

export default router;
