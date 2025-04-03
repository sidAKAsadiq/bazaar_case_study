import { DataTypes } from "sequelize";
import sequelize from "../../db/v1/index.js";
import { Product } from "./product.models.js";

const StockMovement = sequelize.define('StockMovement', {
    product_id: { 
      type: DataTypes.UUID, 
      references: { model: Product, key: 'id' } 
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
     },
  });
  

  StockMovement.belongsTo(Product, { foreignKey: 'product_id' });

  export {StockMovement}