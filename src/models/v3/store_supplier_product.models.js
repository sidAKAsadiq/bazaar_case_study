import { DataTypes } from "sequelize";
import sequelize from "../../db/v3/index.js";
import { Supplier } from "./supplier.models.js";
import { Product } from "./product.models.js";
import { Store } from "./store.models.js";
import { log_activity } from "../../utils/activity_logger.js";


const StoreSupplierProduct = sequelize.define("StoreSupplierProduct", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  store_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Store, key: "id" },
  },
  supplier_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Supplier, key: "id" },
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Product, key: "id" },
  },
  sourcing_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }, 
});

StoreSupplierProduct.belongsTo(Store, { foreignKey: "store_id" });
StoreSupplierProduct.belongsTo(Supplier, { foreignKey: "supplier_id" });
StoreSupplierProduct.belongsTo(Product, { foreignKey: "product_id" });


StoreSupplierProduct.afterCreate(async (record, options) => {
  if (options?.user_id) {
    event_bus.emit("activity" ,{
      user_id: options.user_id,
      action: "create_store_supplier_product",
      model: "StoreSupplierProduct",
      model_id: record.id,
      metadata: {
        store_id: record.store_id,
        supplier_id: record.supplier_id,
        product_id: record.product_id,
        sourcing_price: record.sourcing_price,
      },
    });
  }
});

StoreSupplierProduct.afterUpdate(async (record, options) => {
  if (options?.user_id) {
    event_bus.emit("activity" ,{
      user_id: options.user_id,
      action: "update_store_supplier_product",
      model: "StoreSupplierProduct",
      model_id: record.id,
      metadata: {
        before: record._previousDataValues,
        after: record.dataValues,
      },
    });
  }
});





export {StoreSupplierProduct}
