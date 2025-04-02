import { Router } from "express";
import { registerUser, userLogin } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator } from "../validators/userRegistration.validator.js";
const router = Router();

//this is called factory pattern
router
  .route("/register")
  .post(userRegistrationValidator(), validate, registerUser);
export default router;
