import { Router } from "express";
import {
  create_store_supplier_product,
  get_all_store_supplier_products,
  get_store_supplier_product_by_id,
  update_store_supplier_product,
  delete_store_supplier_product,
  get_records_by_store,
  get_records_by_supplier,
  get_records_by_product
} from "../../controllers/v2/store_supplier_product.controller.js";

import { verify_jwt } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/create_store_supplier_product", verify_jwt, create_store_supplier_product);
router.get("/get_all_store_supplier_products", verify_jwt, get_all_store_supplier_products);
router.get("/get_store_supplier_product/:id", verify_jwt, get_store_supplier_product_by_id);
router.put("/update_store_supplier_product/:id", verify_jwt, update_store_supplier_product);
router.delete("/delete_store_supplier_product/:id", verify_jwt, delete_store_supplier_product);

// Filtered routes
router.get("/get_records_by_store", verify_jwt, get_records_by_store);
router.get("/get_records_by_supplier", verify_jwt, get_records_by_supplier);
router.get("/get_records_by_product", verify_jwt, get_records_by_product);

export default router;
