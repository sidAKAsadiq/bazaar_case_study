import { DataTypes } from "sequelize";
import sequelize from "../../db/v3/index.js";
import { log_activity } from "../../utils/activity_logger.js";

const Store = sequelize.define("Store", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: { 
      type: DataTypes.STRING,
      allowNull: false 
    },
    location: { 
      type: DataTypes.STRING 
    }
  });
  
  
  Store.afterCreate(async (store, options) => {
    if (options?.user_id) {
      event_bus.emit("activity" ,{
        user_id: options.user_id,
        action: "create_store",
        model: "Store",
        model_id: store.id,
        metadata: { name: store.name },
      });
    }
  });
  
  Store.afterUpdate(async (store, options) => {
    if (options?.user_id) {
      event_bus.emit("activity" ,{
        user_id: options.user_id,
        action: "update_store",
        model: "Store",
        model_id: store.id,
        metadata: {
          before: store._previousDataValues,
          after: store.dataValues,
        },
      });
    }
  });
  
  Store.afterDestroy(async (store, options) => {
    if (options?.user_id) {
      event_bus.emit("activity" ,{
        user_id: options.user_id,
        action: "delete_store",
        model: "Store",
        model_id: store.id,
        metadata: { name: store.name },
      });
    }
  });
  


  export { Store };
  