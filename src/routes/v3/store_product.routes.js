import { Router } from "express";
import {
  create_store_product,
  get_all_store_products,
  get_store_product_by_id,
  update_store_product,
  delete_store_product,
  get_store_products_by_category,
  get_store_products_by_store,
  get_store_products_by_product
} from "../../controllers/v3/store_product.controller.js";

import { verify_jwt } from "../../middlewares/auth.middleware.js";
import {authorize_roles} from "../../middlewares/authorize_roles.middleware.js"



const router = Router();

router.post("/create_store_product", verify_jwt, authorize_roles("admin", "store_manager"), create_store_product);
router.get("/get_all_store_products", verify_jwt, get_all_store_products);
router.get("/get_store_products_by_store", verify_jwt, get_store_products_by_store);
router.get("/get_store_products_by_product", verify_jwt, get_store_products_by_product);
router.get("/get_store_products_by_category", verify_jwt, get_store_products_by_category);
router.get("/get_store_product/:id", verify_jwt, get_store_product_by_id);
router.put("/update_store_product/:id", verify_jwt, authorize_roles("admin", "store_manager"), update_store_product);
router.delete("/delete_store_product/:id", verify_jwt, authorize_roles("admin", "store_manager"), delete_store_product);


export default router;
