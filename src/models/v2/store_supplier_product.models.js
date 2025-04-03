import { DataTypes } from "sequelize";
import sequelize from "../../db/v2/index.js";
import { Supplier } from "./supplier.models.js";
import { Product } from "./product.models.js";
import { Store } from "./store.models.js";

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


export {StoreSupplierProduct}
