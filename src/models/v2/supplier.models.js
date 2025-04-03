import { DataTypes } from "sequelize";
import sequelize from "../../db/v2/index.js";

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

export {Supplier}