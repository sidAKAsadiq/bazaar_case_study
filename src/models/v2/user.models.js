import { DataTypes } from "sequelize";
import sequelize from "../../db/v2/index.js";
import { Store } from "./store.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "store_manager", "staff"),
    allowNull: false,
  },
  store_id: {
    type: DataTypes.UUID,
    references: { model: Store, key: 'id' },
    allowNull: true // Admins don’t belong to a specific store and also considering that a user can belong to only a single store at a time 
  },
  refresh_token : {
    type: DataTypes.STRING
  }
});

User.belongsTo(Store, { foreignKey: 'store_id', allowNull: true });

User.beforeCreate(async (user, options) => {
  if (user.password) {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  }
});

User.beforeUpdate(async (user, options) => {
  if (user.changed("password")) {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  }
});

User.prototype.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


User.prototype.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      store_id : this.store_id
    },
    process.env.ACCESS_TOKEN_SECRET,
    { 
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

User.prototype.generateRefreshToken = function () {
  return jwt.sign(
    { 
      id: this.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
    }
  );
};


export { User };