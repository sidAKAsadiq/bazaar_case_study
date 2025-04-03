import { DataTypes } from "sequelize";
import sequelize from "../../db/v2/index.js";

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
  
  export { Store };
  