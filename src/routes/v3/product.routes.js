import { Router } from "express";
import {
  create_product,
  get_all_products,
  get_filtered_products,
  get_product_by_id,
  update_product,
  delete_product
} from "../../controllers/v3/product.controller.js";

import { verify_jwt } from "../../middlewares/auth.middleware.js";
import {authorize_roles} from "../../middlewares/authorize_roles.middleware.js"

const router = Router();

router.post("/create_product", verify_jwt, authorize_roles("admin", "store_manager"), create_product);
router.get("/get_all_products", verify_jwt, get_all_products);
router.get("/get_filtered_products", verify_jwt, get_filtered_products);
router.get("/get_product/:id", verify_jwt, get_product_by_id);
router.put("/update_product/:id", verify_jwt, authorize_roles("admin", "store_manager"), update_product);
router.delete("/delete_product/:id", verify_jwt, authorize_roles("admin", "store_manager"), delete_product);


export default router;
