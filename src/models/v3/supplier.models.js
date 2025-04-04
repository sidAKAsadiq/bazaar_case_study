import { DataTypes } from "sequelize";
import sequelize from "../../db/v3/index.js";
import {log_activity} from "../../utils/activity_logger.js"

const Supplier = sequelize.define('Supplier', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_info: {
        type: DataTypes.STRING,
        allowNull: true
    }
  });
  Supplier.afterCreate(async (supplier, options) => {
    if (options?.user_id) {
      event_bus.emit("activity" ,{
        user_id: options.user_id,
        action: "create_supplier",
        model: "Supplier",
        model_id: supplier.id,
        metadata: {
          name: supplier.name,
        },
      });
    }
  });
  
  Supplier.afterUpdate(async (supplier, options) => {
    if (options?.user_id) {
      event_bus.emit("activity" ,{
        user_id: options.user_id,
        action: "update_supplier",
        model: "Supplier",
        model_id: supplier.id,
        metadata: {
          before: supplier._previousDataValues,
          after: supplier.dataValues,
        },
      });
    }
  });
  
  Supplier.afterDestroy(async (supplier, options) => {
    if (options?.user_id) {
      event_bus.emit("activity" ,{
        user_id: options.user_id,
        action: "delete_supplier",
        model: "Supplier",
        model_id: supplier.id,
        metadata: {
          name: supplier.name,
        },
      });
    }
  });
  



export {Supplier}