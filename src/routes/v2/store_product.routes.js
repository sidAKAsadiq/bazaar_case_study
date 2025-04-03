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
} from "../../controllers/v2/store_product.controller.js";

import { verify_jwt } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/create_store_product", verify_jwt, create_store_product);
router.get("/get_all_store_products", verify_jwt, get_all_store_products);
router.get("/get_store_products_by_store", verify_jwt, get_store_products_by_store);
router.get("/get_store_products_by_product", verify_jwt, get_store_products_by_product);
router.get("/get_store_products_by_category", verify_jwt, get_store_products_by_category);
router.get("/get_store_product/:id", verify_jwt, get_store_product_by_id);
router.put("/update_store_product/:id", verify_jwt, update_store_product);
router.delete("/delete_store_product/:id", verify_jwt, delete_store_product);

export default router;
