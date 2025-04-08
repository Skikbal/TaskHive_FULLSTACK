import { Router } from "express";
import {
  registerUserHandler,
  loginUserHandler,
  verifyEmailHandler,
  resendEmailVerificationHandler,
  logoutUserHandler,
  refreshAccessTokenHandler,
  forgotPasswordRequestHandler,
  resetForgottenPasswordHandler,
  changeCurrentPasswordHandler,
  getCurrentUserHandler,
} from "../controllers/auth.controllers.js";
import validate from "../middlewares/validator.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  userLoginValidator,
  userRegistrationValidator,
} from "../validators/index.js";
import isAuth from "../middlewares/isAuth.middleware.js";

const router = Router();

//common routes
//this is called factory pattern

router
  .route("/register")
  .post(
    upload.single("avatar"),
    userRegistrationValidator(),
    validate,
    registerUserHandler,
  );
router.route("/login").post(userLoginValidator(), validate, loginUserHandler);
router.route("/verify-email").get(verifyEmailHandler);
router.route("/resend-verify-email").post(resendEmailVerificationHandler);
router.route("/refresh-token").get(refreshAccessTokenHandler);
router.route("/forgot-password-request").post(forgotPasswordRequestHandler);
router.route("/reset-password").post(resetForgottenPasswordHandler);
//protected routes
router.route("/logout").post(isAuth, logoutUserHandler);
router.route("/change-password").post(isAuth, changeCurrentPasswordHandler);
router.route("/user").get(isAuth,getCurrentUserHandler);

export default router;
