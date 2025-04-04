import { DataTypes } from "sequelize";
import sequelize from "../../db/v3/index.js";
import { Store } from "./store.models.js";
import { Product } from "./product.models.js";
import { log_activity } from "../../utils/activity_logger.js";
import event_bus from "../../events/event_bus.js";

const StoreProduct = sequelize.define("StoreProduct", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    store_id: {
      type: DataTypes.UUID,
      references: { model: Store, key: 'id' }
    },
    product_id: {
      type: DataTypes.UUID,
      references: { model: Product, key: 'id' }
    },
    current_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    selling_price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });
  
  StoreProduct.belongsTo(Store, { foreignKey: 'store_id' });
  StoreProduct.belongsTo(Product, { foreignKey: 'product_id' });
  
  StoreProduct.afterCreate(async (record, options) => {
    if (options?.user_id) {
       event_bus.emit("activity" , {
        user_id: options.user_id,
        action: "create_store_product",
        model: "StoreProduct",
        model_id: record.id,
        metadata: {
          store_id: record.store_id,
          product_id: record.product_id,
          selling_price: record.selling_price,
        },
      });
    }
  });
  
  StoreProduct.afterUpdate(async (record, options) => {
    if (options?.user_id) {
      event_bus.emit("activity" ,{
        user_id: options.user_id,
        action: "update_store_product",
        model: "StoreProduct",
        model_id: record.id,
        metadata: {
          before: record._previousDataValues,
          after: record.dataValues,
        },
      });
    }
  });
  
  StoreProduct.afterDestroy(async (record, options) => {
    if (options?.user_id) {
      event_bus.emit("activity" ,{
        user_id: options.user_id,
        action: "delete_store_product",
        model: "StoreProduct",
        model_id: record.id,
        metadata: {
          store_id: record.store_id,
          product_id: record.product_id,
        },
      });
    }
  });
  




  export { StoreProduct };
  