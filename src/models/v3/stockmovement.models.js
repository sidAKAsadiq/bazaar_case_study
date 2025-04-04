import { DataTypes } from "sequelize";
import sequelize from "../../db/v3/index.js";
import { StoreProduct } from "./store_product.models.js";
import { log_activity } from "../../utils/activity_logger.js"
import event_bus from "../../events/event_bus.js";

const StockMovement = sequelize.define("StockMovement", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    store_product_id: { 
      type: DataTypes.UUID, 
      references: { model: StoreProduct, key: 'id' } 
    },
    type: { 
      type: DataTypes.ENUM('stock-in', 'sale', 'manual-removal'), 
      allowNull: false 
    },
    quantity: { 
      type: DataTypes.INTEGER, 
      allowNull: false
    },
    timestamp: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW
    }
  });
  
  StockMovement.belongsTo(StoreProduct, { foreignKey: 'store_product_id' });
  
// For real time sync - After creating a stock movement, update the store product quantity

StockMovement.afterCreate(async (movement, options) => {
  const { store_product_id, type, quantity, id } = movement;
  const storeProduct = await StoreProduct.findByPk(store_product_id);
  if (!storeProduct) return;

  // Update quantity
  
  event_bus.emit("update_quantity" , {
    storeProduct: storeProduct,
    type : type,
    quantity : quantity
  });

  // Log activity (only if we have user from options context)
  if (options?.user_id) {
      event_bus.emit("activity" , {
      user_id: options.user_id,
      action: `stock_${type}`,
      model: "StockMovement",
      model_id: id,
      metadata: { quantity, store_product_id }
    });
  }
});





  export { StockMovement };
  