import { body } from "express-validator";
import { availableUserRoles } from "../constants/constant.js";

const projectValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is Required !")
      .isLength({ min: 3 })
      .withMessage("Project name must be at least 3 characters long !")
      .isLength({ max: 20 })
      .withMessage("Project name must be at most 20 characters long !"),
  ];
};

const projectMemberRoleValidator = () => {
  return [
    body("role")
      .trim()
      .isIn(availableUserRoles)
      .withMessage("Role must be project_admin or member !"),
  ];
};

export { projectValidator, projectMemberRoleValidator };
