import { Router } from "express";
import isAuth from "../middlewares/isAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  subTaskValidator,
  taskValidator,
} from "../validators/task.validator.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createSubTaskHandler,
  createTaskHandler,
  deleteSubTaskHandler,
  deleteTaskHandler,
  getTaskByIdHandler,
  getTasksHandler,
  updateSubTaskHandler,
  updateTaskHandler,
} from "../controllers/task.controllers.js";
import multer from "multer";
const router = Router();

router
  .route("/new-task")
  .post(
    isAuth,
    upload.array("attachments", 10),
    taskValidator(),
    validate,
    createTaskHandler,
  );

router
  .route("/update-task/:taskId")
  .put(isAuth, upload.array("attachments", 10), updateTaskHandler);

router.route("/delete-task/:taskId").delete(isAuth, deleteTaskHandler);
router.route("/all-tasks").get(isAuth, getTasksHandler);
router.route("/:taskId").get(isAuth, getTaskByIdHandler);

//subtask routes
router
  .route("/:taskId/new-sub-task")
  .post(isAuth,createSubTaskHandler);
router.route("/sub-task/update/:subTaskId").put(isAuth, updateSubTaskHandler);
router
  .route("/sub-task/delete/:subTaskId")
  .delete(isAuth, deleteSubTaskHandler);

export default router;
