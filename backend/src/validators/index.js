import { body } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is Required !")
      .isEmail()
      .withMessage("Email is invalid !"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is Required !")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long !")
      .isLength({ max: 13 })
      .withMessage("Username must be at most 13 characters long !"),
    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("Fullname is Required !")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Fullname must not contain special characters !"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is Required !")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long !")
      .isLength({ max: 20 })
      .withMessage("Password must be at most 20 characters long !")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
      )
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character !",
      ),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is Required !")
      .isEmail()
      .withMessage("Email is invalid !"),
    body("password").trim().notEmpty().withMessage("Password is Required !"),
  ];
};

export { userRegistrationValidator, userLoginValidator };
