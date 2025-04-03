import { DataTypes } from "sequelize";
import sequelize from "../../db/v2/index.js";
import { StoreProduct } from "./store_product.models.js";

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
  
  export { StockMovement };
  