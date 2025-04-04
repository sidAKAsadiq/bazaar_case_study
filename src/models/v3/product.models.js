import { DataTypes } from "sequelize";
import sequelize from "../../db/v3/index.js";
import { log_activity } from "../../utils/activity_logger.js";
import event_bus from "../../events/event_bus.js";

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



Product.afterUpdate(async (product, options) => {
  if (options?.user_id) {
    // We'll use the _previousDataValues Sequelize gives us to compare old vs new
    const oldData = product._previousDataValues;
    const newData = product.dataValues;

      event_bus.emit("activity",{
        user_id: options.user_id,
        action: "update_product",
        model: "Product",
        model_id: product.id,
        metadata: {
          changed_fields: changedFields,
          before: oldData,
          after: newData,
        },
      });
      
  }
});



export { Product };
