import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/User.model.js";
const isAuth = async (req, res, next) => {
  const { accesstoken } = req.cookies;

  if (!accesstoken) {
    return next(new ApiError(401, "Access token missing. Unauthorized"));
  }
  try {
    const decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(404, "User not found.Unauthorized");
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired access token."));
  }
};

export default isAuth;
