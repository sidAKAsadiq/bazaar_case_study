import { api_error } from "../utils/api_error.js";


const authorize_roles = (...allowed_roles) => {
  return (req, _res, next) => {
    const user = req.user;

    if (!user || !allowed_roles.includes(user.role)) {
      throw new api_error(403, "You do not have permission to access this resource.");
    }

    next();
  };
};

export { authorize_roles };
