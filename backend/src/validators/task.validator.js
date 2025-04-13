import { body } from "express-validator";
import { availableTaskStatus } from "../constants/constant.js";

const taskValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is Required !")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long !"),
    body("projectId").trim().notEmpty().withMessage("Project is Required !"),
    body("assignedToId")
      .trim()
      .notEmpty()
      .withMessage("Assigned To is Required !"),
    body("status")
      .isIn(availableTaskStatus)
      .withMessage("Status must be todo or in_progress or completed !"),
  ];
};

const subTaskValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is Required !")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long !"),
    body("taskId")
    .trim()
    .notEmpty()
    .withMessage("Task is Required !"),
  ];
};

export { taskValidator, subTaskValidator };
