import { Router } from "express";
import {
  record_stock_movement,
  get_all_stock_movements,
  get_stock_movement_by_id,
  get_movements_by_store,
  get_movements_by_date_range
} from "../../controllers/v2/stockmovement.controller.js";

import { verify_jwt } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/record_stock_movement", verify_jwt, record_stock_movement);
router.get("/get_all_stock_movements", verify_jwt, get_all_stock_movements);
router.get("/get_stock_movement/:id", verify_jwt, get_stock_movement_by_id);
router.get("/get_movements_by_store", verify_jwt, get_movements_by_store);
router.get("/get_movements_by_date_range", verify_jwt, get_movements_by_date_range);

export default router;
