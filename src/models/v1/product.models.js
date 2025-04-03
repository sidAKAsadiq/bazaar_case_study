import { DataTypes } from "sequelize";
import sequelize from "../../db/v1/index.js";
import { Supplier } from "./supplier.models.js";


const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
},
  name:{ 
    type: DataTypes.STRING,
    allowNull: false 
  },
  category:{ 
    type: DataTypes.STRING 
  },
  price:{ 
    type: DataTypes.FLOAT, 
    allowNull: false
  },
  current_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
},
  supplier_id: {
    type: DataTypes.INTEGER,
    references: {
        model: Supplier,
        key: 'id'
    }
}
});


Product.belongsTo(Supplier, { foreignKey: 'supplier_id' });


export { Product };
