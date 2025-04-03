import { DataTypes } from "sequelize";
import sequelize from "../../db/v2/index.js";
import { Store } from "./store.models.js";
import { Product } from "./product.models.js";

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
  
  export { StoreProduct };
  