//maqsad -> To check wheater or not user is logged in
import { User } from "../models/v2/user.models.js";
import { api_error } from "../utils/api_error.js";
import { async_handler } from "../utils/async_handler.js";
import jwt from "jsonwebtoken";

const verify_jwt = async_handler(async (req, _, next) => {
  try {
    //Getting token from the logged in user     //this syntax if we have header cmng for e.g from mobile
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new api_error(400, "User does not have a token!");
    }
    //verifying token
    console.log(token);
    //Decoding token - we have stored some info in tokens - refer to user model
    const decoded_token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log(`de: `, decoded_token.id);
    //finding user based on id stored in decoded token
    const user = await User.findByPk(decoded_token.id, {
      attributes: { exclude: ["refresh_token", "password"] },
    });

    console.log(user);

    if (!user) {
      throw new api_error(
        400,
        "Cant find user based on id referenced from the decoded token in auth middleware"
      );
    }
    //adding user to request object
    req.user = user;
    next();
  } catch (error) {
    throw new api_error(400, error || "Invalid access token");
  }
});

export { verify_jwt };
