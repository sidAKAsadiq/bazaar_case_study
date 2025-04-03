import { Router } from "express";
import { register_user , login_user, logout_user, refresh_access_token, get_current_user,} from "../../controllers/v2/user.controller.js";
import { verify_jwt } from "../../middlewares/auth.middleware.js";
import { authorize_user_roles } from "../../middlewares/authorize_user_roles.middleware.js";
import { auth_limiter } from "../../middlewares/request_throttle.middleware.js";

const router = Router()

router.route('/register').post(register_user)
router.route('/login').post(auth_limiter,login_user)
//Secured routes
router.route('/logout').post(verify_jwt ,logout_user)
router.route('/refresh_access_token').post(verify_jwt ,refresh_access_token)
router.route('/get_current_user').get(verify_jwt , get_current_user)
router.get("/get_all_users", verify_jwt, authorize_user_roles("admin"), get_all_users);
router.get("/get_users_by_store", verify_jwt, authorize_user_roles("admin", "store_manager"), get_users_by_store);



export default router