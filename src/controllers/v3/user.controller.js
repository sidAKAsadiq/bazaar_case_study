import { async_handler } from "../../utils/async_handler.js";
import { api_error } from "../../utils/api_error.js";
import { User } from "../../models/v3/user.models.js";
import { api_response } from "../../utils/api_response.js"
import jwt from "jsonwebtoken"
import { setToCache, getFromCache, invalidateCache } from "../../utils/cache.js";
import event_bus from "../../events/event_bus.js";

const generate_access_and_refresh_tokens = async(user_obj) => {
    try {
        console.log("sup")
        const access_token = user_obj.generate_access_token()
        const refresh_token = user_obj.generate_refresh_token()
        console.log(access_token)
        console.log(refresh_token)
        user_obj.refresh_token = refresh_token
        await user_obj.save({validateBeforeSave : false})
        
        return {access_token , refresh_token}

    } catch (error) {
        console.log(error)
        throw new api_error(500, "Token generation error" )
    }
}

const register_user = async_handler(async (req, res) => {
    const { name, email, password, role, store_id } = req.body;
  
    if ([name, email, password, role].some((field) => !field?.trim())) {
      throw new api_error(400, "All fields (name, email, password, role) are required.");
    }
  
    const existingUser = await User.findOne({
      where: { email }
    });
  
    if (existingUser) {
      throw new api_error(409, "A user with this email already exists.");
    }
  
    const new_user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      store_id: role !== "admin" ? store_id : null
    });
  
    const created_user = await User.findByPk(new_user.id, {
      attributes: { exclude: ["password", "refresh_token"] }
    });
  
    if (!created_user) {
      throw new api_error(500, "Something went wrong during registration.");
    }

    event_bus.emit("cache:invalidate", { key: `users:all` });

  
    return res.status(201).json(new api_response(201, created_user, "User registered successfully!"));
  });
  


const login_user = async_handler(async (req, res) => {
    const { username_or_email, password } = req.body;
  
    if (!username_or_email?.trim() || !password?.trim()) {
      throw new api_error(400, "Username/email and password are required.");
    }
  
    // Find user by email (your model does not use username anymore)
    const user = await User.findOne({
      where: {
        email: username_or_email
      }
    });
  
    if (!user) {
      throw new api_error(404, "Incorrect email. Please try again or register.");
    }
  
    // Verify password
    const is_password_valid = await user.checkPassword(password);
    if (!is_password_valid) {
      throw new api_error(401, "Invalid credentials. Please try again.");
    }
  
    // Generate tokens
    const { access_token, refresh_token } = await generate_access_and_refresh_tokens(user);
  
    // Strip sensitive fields
    const safe_user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      store_id: user.store_id,
    };
  
    // Send cookies
    const cookie_options = {
      httpOnly: true,
      secure: true, // set to false during local dev if not using https
    };
  
    return res
      .status(200)
      .cookie("access_token", access_token, cookie_options)
      .cookie("refresh_token", refresh_token, cookie_options)
      .json(new api_response(200, {
        user: safe_user,
        access_token,
        refresh_token
      }, "Login successful!"));
  });

const logout_user = async_handler(async (req, res) => {
    // Remove refresh_token for the logged-in user
    await User.update(
      { refresh_token: null },
      { where: { id: req.user.id } }
    );
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
      .status(200)
      .clearCookie("access_token", options)
      .clearCookie("refresh_token", options)
      .json(new api_response(200, {}, "Logout successful!"));
  });
    

  const refresh_access_token = async_handler(async (req, res) => {
    const user_refresh_token = req.cookies.refresh_token || req.body.refresh_token;
  
    if (!user_refresh_token) {
      throw new api_error(400, "User doesn't have a refresh token.");
    }
  
    // Verify token
    let decoded_token;
    try {
      decoded_token = jwt.verify(user_refresh_token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw new api_error(401, "Invalid or expired refresh token.");
    }
  
    const user = await User.findByPk(decoded_token.id);
  
    if (!user) {
      throw new api_error(404, "No user exists with this token.");
    }
  
    if (user.refresh_token !== user_refresh_token) {
      throw new api_error(403, "Refresh tokens do not match.");
    }
  
    const { access_token, refresh_token } = await generate_access_and_refresh_tokens(user);
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
      .status(200)
      .cookie("access_token", access_token, options)
      .cookie("refresh_token", refresh_token, options)
      .json(new api_response(200, {}, "New tokens sent!"));
  });

const get_current_user = async_handler(async (req, res) => {
    const { password, refresh_token, ...safe_user } = req.user?.dataValues || {};
  
    return res
      .status(200)
      .json(new api_response(200, { user: safe_user }, "Returning current user successfully!"));
  });

  const get_all_users = async_handler(async (_req, res) => {
    const cacheKey = "users:all";
  
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "All users (from cache)"));
    }
  
    const users = await User.findAll({
      attributes: { exclude: ["password", "refresh_token"] }
    });
    
    await setToCache(cacheKey, users, 60); // 1 minute TTL
  
    return res.status(200).json(new api_response(200, users, "All users"));
  });
  
  const get_users_by_store = async_handler(async (req, res) => {
    const { store_id } = req.query;
  
    if (!store_id) {
      throw new api_error(400, "store_id is required.");
    }
  
    const cacheKey = `users:store:${store_id}`;
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "Users by store (from cache)"));
    }
  
    const users = await User.findAll({
      where: { store_id },
      attributes: { exclude: ["password", "refresh_token"] }
    });
  
    await setToCache(cacheKey, users, 30);
  
    return res.status(200).json(new api_response(200, users, "Users by store"));
  });
  
  

  const update_user_role = async_handler(async (req, res) => {
    const { id } = req.params;
    const { new_role } = req.body;
  
    const user = await User.findByPk(id);
    if (!user) {
      throw new api_error(404, "User not found.");
    }
  
    user.role = new_role;
    await user.save({ user_id: req.user.id }); 
    event_bus.emit("cache:invalidate", { key: `users:all` });

   
    return res.status(200).json(
      new api_response(200, user, "User role updated successfully.")
    );
  });
  
  const delete_user = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const user = await User.findByPk(id);
    if (!user) {
      throw new api_error(404, "User not found.");
    }
  
    await user.destroy({ user_id: req.user.id }); 
    event_bus.emit("cache:invalidate", { key: `users:all` });

  

    return res.status(200).json(
      new api_response(200, {}, "User deleted successfully.")
    );
  });
  



  
export {
  register_user,  
  login_user,
  logout_user,
  refresh_access_token,
  get_current_user,
  get_all_users,
  get_users_by_store,
  update_user_role,
  delete_user,
  
}