import sequelize from "./index.js";

// for syncing
import { Product } from "../../models/v2/product.models.js";
import { Store } from "../../models/v2/store.models.js";
import { Supplier } from "../../models/v2/supplier.models.js";
import { StoreProduct } from "../../models/v2/store_product.models.js";
import { StoreSupplierProduct } from "../../models/v2/store_supplier_product.models.js";
import { StockMovement } from "../../models/v2/stockmovement.models.js";
import { User } from "../../models/v2/user.models.js";



const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");

    await sequelize.sync({ alter: true }); // or { force: true } in dev
    console.log("✅ Models synchronized successfully");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
};

export {connectDB};
