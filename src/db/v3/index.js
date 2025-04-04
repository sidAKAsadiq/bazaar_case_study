import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({
    path : './env'
})

//For now I am adding 2 read-replicas, but we can add as many as we want.
// Also, in production, we'll just have to add write and read replicas links and vars here and it will work as intended
//For now, as we are in localenv, the credentials for write and read replicas stays same
const sequelize = new Sequelize({
  replication: {
    read: [
      {
        host: process.env.READ_REPLICA_1_HOST || "localhost",
        username: process.env.READ_REPLICA_1_USER || "postgres",
        password: process.env.READ_REPLICA_1_PASS || "yourpassword",
        database: process.env.READ_REPLICA_1_DB || "bazaar_db",
        port: process.env.READ_REPLICA_1_PORT || 5432,
      },
      {
        host: process.env.READ_REPLICA_2_HOST || "localhost",
        username: process.env.READ_REPLICA_2_USER || "postgres",
        password: process.env.READ_REPLICA_2_PASS || "yourpassword",
        database: process.env.READ_REPLICA_2_DB || "bazaar_db",
        port: process.env.READ_REPLICA_2_PORT || 5432,
      }
    ],
    write: {
      host: process.env.WRITE_DB_HOST || "localhost",
      username: process.env.WRITE_DB_USER || "postgres",
      password: process.env.WRITE_DB_PASS || "yourpassword",
      database: process.env.WRITE_DB_NAME || "bazaar_db",
      port: process.env.WRITE_DB_PORT || 5432,
    }
  },
  dialect: "postgres",
  pool: {
    max: 10,
    idle: 30000,
    acquire: 60000,
  },
  logging: false, 
});

export default sequelize;

