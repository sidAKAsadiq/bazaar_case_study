import sequelize from "./index.js";

// for syncing
import { User } from "../../models/v3/user.models.js";
import { Product } from "../../models/v3/product.models.js";
import { Store } from "../../models/v3/store.models.js";
import { Supplier } from "../../models/v3/supplier.models.js";
import { StoreProduct } from "../../models/v3/store_product.models.js";
import { StoreSupplierProduct } from "../../models/v3/store_supplier_product.models.js";
import { StockMovement } from "../../models/v3/stockmovement.models.js";
import { ActivityLog } from "../../models/v3/activity_log.models.js";

//seperatly here to resolve circular dependency
ActivityLog.belongsTo(User, { foreignKey: "user_id" }); 


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
