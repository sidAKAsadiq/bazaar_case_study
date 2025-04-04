import { DataTypes } from "sequelize";
import sequelize from "../../db/v3/index.js";
import { User } from "./user.models.js";

const ActivityLog = sequelize.define("ActivityLog", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: { 
        type: DataTypes.UUID, 
        references: { model: "Users", key: 'id' } 
      },    
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    }
  });
  
  // Reference "Users" — so it’s a valid "Users" ID
  //ActivityLog.belongsTo("Users", { foreignKey: "user_id" });
  
export { ActivityLog };
