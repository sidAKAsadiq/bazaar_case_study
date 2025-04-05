import dotenv from "dotenv"
import {app} from "./app.js"

 // ------------ Version : 1
//import sequelize from "./db/v1/index.js"       


//-------------- Version : 2
//import { connectDB } from "./db/v2/connection.js"  



// --------------Version : 3
import { connectDB } from "./db/v3/connection.js"   
import redisClient from "./db/v3/redis.js"
import "./events/listeners/activity_log.listener.js"
import "./events/listeners/update_quantity.listener.js"
import "./events/listeners/invalidate_cache.listener.js"

const PORT = process.env.PORT || 5050;

dotenv.config({
    path : './.env'
})

//------------Version : 1
// sequelize.sync().then(() => {
//     app.listen(9090, () => console.log('Server running on port 5050'));
//   });



//------------Version : 2 
//connectDB();



//-----------Verision : 3
connectDB();



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });  