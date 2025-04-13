import { Router } from "express";
import isAuth from "../middlewares/isAuth.middleware.js";
import validate from "../middlewares/validator.middleware.js";
import {
  projectMemberRoleValidator,
  projectValidator,
} from "../validators/project.validator.js";
import {
  addMemberToProjectHandler,
  createProjectHandler,
  deleteMemberHandler,
  deleteProjectHandler,
  getProjectByIdHandler,
  getProjectMembersHandler,
  getProjectsHandler,
  updateMemberRoleHandler,
  updateProjectHandler,
} from "../controllers/project.controllers.js";

const router = Router();

//project routes
router.route("/").get(isAuth, getProjectsHandler);
router.route("/:projectId").get(isAuth, getProjectByIdHandler);
router
  .route("/new-project")
  .post(isAuth, projectValidator(), validate, createProjectHandler);
router
  .route("/update-project/:projectId")
  .put(isAuth, projectValidator(), validate, updateProjectHandler);
router.route("/delete-project/:projectId").delete(isAuth, deleteProjectHandler);

//project members routes
router.route("/project-members/:projectId").get(isAuth,getProjectMembersHandler);
router
  .route("/add-member/:projectId/:userId")
  .post(isAuth, addMemberToProjectHandler);
router.route("/delete-member/:memberId").delete(isAuth, deleteMemberHandler);
router
  .route("/project-members/:memberId")
  .put(isAuth, projectMemberRoleValidator(), validate, updateMemberRoleHandler);

export default router;
