import { Router } from "express";
import { register_user , login_user, logout_user, refresh_access_token, get_current_user,update_user_role, get_all_users, get_users_by_store, delete_user} from "../../controllers/v3/user.controller.js";
import { verify_jwt } from "../../middlewares/auth.middleware.js";
import { auth_limiter_v3 } from "../../middlewares/distributed_api_rate_limiting.middleware.js";
import {authorize_roles} from "../../middlewares/authorize_roles.middleware.js"



const router = Router()

router.route('/register').post(register_user)
router.route('/login').post(auth_limiter_v3,login_user)
//Secured routes
router.route('/logout').post(verify_jwt ,logout_user)
router.route('/refresh_access_token').post(verify_jwt ,refresh_access_token)
router.route('/get_current_user').get(verify_jwt , get_current_user)
router.get("/get_all_users", verify_jwt, authorize_roles("admin"), get_all_users);
router.get("/get_users_by_store", verify_jwt, authorize_roles("admin", "store_manager"), get_users_by_store);
router.put("/update_user_role/:id", verify_jwt, authorize_roles("admin"), update_user_role);
router.delete("/delete_user/:id", verify_jwt, authorize_roles("admin"), delete_user);



export default router