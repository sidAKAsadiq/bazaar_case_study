import { Router } from "express";
import {
  get_stock_summary_by_store,
  get_sales_report_by_store_and_date,
  get_stock_movement_summary_by_type,
  get_supplier_sourcing_summary,
  get_full_inventory_summary
} from "../../controllers/v3/reporting.controller.js";

import { verify_jwt } from "../../middlewares/auth.middleware.js";
import { authorize_roles } from "../../middlewares/authorize_roles.middleware.js";

const router = Router();

router.get("/get_stock_summary_by_store", verify_jwt, authorize_roles("admin", "store_manager"), get_stock_summary_by_store);
router.get("/get_sales_report_by_store_and_date", verify_jwt, authorize_roles("admin", "store_manager"), get_sales_report_by_store_and_date);
router.get("/get_stock_movement_summary_by_type", verify_jwt, authorize_roles("admin", "store_manager"), get_stock_movement_summary_by_type);
router.get("/get_supplier_sourcing_summary", verify_jwt, authorize_roles("admin"), get_supplier_sourcing_summary);
router.get("/get_full_inventory_summary", verify_jwt, authorize_roles("admin"), get_full_inventory_summary);

export default router;
