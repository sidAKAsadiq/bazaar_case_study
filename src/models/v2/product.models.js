import { DataTypes } from "sequelize";
import sequelize from "../../db/v2/index.js";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: { 
    type: DataTypes.STRING,
    allowNull: false 
  },
  category: { 
    type: DataTypes.STRING 
  }
});

export { Product };
