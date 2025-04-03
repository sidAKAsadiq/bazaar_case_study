import sequelize from "./db/v1/index.js"
import dotenv from "dotenv"
import {app} from "./app.js"
import { connectDB } from "./db/v2/connection.js"


const PORT = process.env.PORT || 9090;

dotenv.config({
    path : './env'
})

//--V1
// sequelize.sync().then(() => {
//     app.listen(9090, () => console.log('Server running on port 9090'));
//   });

// - v2  

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });  