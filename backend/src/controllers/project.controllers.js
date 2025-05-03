import { asyncHandler } from "../utils/async-handler.js";
import Project from "../models/Project.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import ProjectMember from "../models/Projectmember.model.js";
import { User } from "../models/User.model.js";
import Task from "../models/Task.model.js";
import SubTask from "../models/Subtask.model.js";
import { availableUserRoles, UserRolesEnum } from "../constants/constant.js";
import mongoose from "mongoose";
import withTransactionService from "../services/transaction.service.js";

//get all projects
const getProjectsHandler = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const projects = await Project.find({
    createdBy: _id,
  });

  if (!projects) {
    throw new ApiError(404, "Projects not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Projects fetched successfully", projects));
});

//get projects by id
const getProjectByIdHandler = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(projectId) },
    },
    {
      $lookup: {
        from: "projectmembers",
        localField: "_id",
        foreignField: "project",
        as: "members",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $unwind: "$createdBy",
    },
    {
      $project: {
        "createdBy.password": 0,
        "createdBy.refreshToken": 0,
      },
    },
    {
      // $group: {
      //   _id: "$isCompleted",
      // },
    },
  ]);

  if (project.length === 0) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Project fetched successfully", project));
});

//create project handler
const createProjectHandler = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const _id = req.user?._id;

  //check if project already exists
  const existingProject = await Project.findOne({
    name,
    createdBy: _id,
  });

  if (existingProject) {
    throw new ApiError(400, "Project already exists");
  }

  const project = await withTransactionService(async (session) => {
    const [newProject] = await Project.create(
      [
        {
          name,
          description,
          createdBy: _id,
        },
      ],
      {
        session,
      },
    );
    await ProjectMember.create(
      [
        {
          project: newProject._id,
          user: _id,
          role: UserRolesEnum.PROJECT_ADMIN,
        },
      ],
      {
        session,
      },
    );
    return newProject;
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Project created successfully", project));
});

//update project handler
const updateProjectHandler = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { projectId } = req.params;
  const { name, description } = req.body;

  const projectmeber = await ProjectMember.validateRoleForProjectUpdate(
    projectId,
    userId,
  );

  if (!projectmeber) {
    throw new ApiError(403, "You are not authorized to update this project");
  }

  const updatedProject = await Project.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $set: {
        name,
        description,
      },
    },
    { new: true }, // returns the updated document
  );

  if (!updatedProject) {
    throw new ApiError(404, "Project not found or failed to update");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Project updated", updatedProject));
});

//delete project handler
const deleteProjectHandler = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { projectId } = req.params;

  const projectmeber = await ProjectMember.validateRoleForProjectUpdate(
    projectId,
    userId,
  );

  if (!projectmeber) {
    throw new ApiError(403, "You are not authorized to update this project");
  }

  //find project
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  //get all the task ids
  const taskIds = await Task.find({ project: projectId }).select("_id");

  const deletedProject = await withTransactionService(async (session) => {
    await SubTask.deleteMany({ task: { $in: taskIds } }).session(session);
    await Task.deleteMany({ _id: { $in: taskIds } }).session(session);
    await ProjectMember.deleteMany({ project: projectId }).session(session);
    const deleteProject = await Project.findByIdAndDelete(projectId)
      .select(projectId)
      .session(session);

    return deleteProject;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Project deleted", deletedProject));
});

//get project members handler
const getProjectMembersHandler = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const projectMembers = await ProjectMember.find({ project: projectId });

  if (!projectMembers) {
    throw new ApiError(404, "Project members not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Project members fetched successfully",
        projectMembers,
      ),
    );
});

//add member to project Handler
const addMemberToProjectHandler = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const userId = req.user._id;

  const existingMemberInProject = await ProjectMember.findOne({
    project: projectId,
    user: memberId,
  });

  if (existingMemberInProject) {
    throw new ApiError(400, "Member already exists in this project");
  }

  //check if user is admin or project admin
  const projectmeber = await ProjectMember.validateRoleForProjectUpdate(
    projectId,
    userId,
  );

  if (!projectmeber) {
    throw new ApiError(403, "You are not authorized to update this project");
  }

  const newProjectMember = await ProjectMember.create({
    project: projectId,
    user: memberId,
  });

  if (!newProjectMember) {
    throw new ApiError(400, "Project member creation failed");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Project member added successfully",
        newProjectMember,
      ),
    );
});

//delete project member handler
const deleteMemberHandler = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const userId = req.user._id;

  //check if user is admin or project admin
  const projectmeber = await ProjectMember.validateRoleForProjectUpdate(
    projectId,
    userId,
  );

  if (!projectmeber) {
    throw new ApiError(403, "You are not authorized to update this project");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const taskIds = await Task.find({ assignedTo: memberId }).select("_id");

  await SubTask.deleteMany({ task: { $in: taskIds } });
  await Task.deleteMany({ _id: { $in: taskIds } });

  const deletedMember = await ProjectMember.findByIdAndDelete(memberId);
  console.log(deletedMember);
  //commit transaction
  session.commitTransaction();
  session.endSession();

  if (!deletedMember) {
    throw new ApiError(404, "Member not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Member deleted", deletedMember));
});

//update member role handler
const updateMemberRoleHandler = asyncHandler(async (req, res) => {
  const { memberId } = req.params;
  const { role } = req.body;

  const userId = req.user._id;
  //check if user is admin or project admin
  const user = await User.findById(userId).select("role");
  if (user.role !== "admin" || user.role !== "project_admin") {
    throw new ApiError(
      403,
      "You are not authorized to update role of this member",
    );
  }

  const updatedMember = await ProjectMember.findByIdAndUpdate(
    {
      _id: memberId,
    },
    {
      $set: {
        role,
      },
    },
    { new: true }, // returns the updated document
  );
  if (!updatedMember) {
    throw new ApiError(404, "Member not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Member updated", updatedMember));
});

export {
  addMemberToProjectHandler,
  createProjectHandler,
  deleteMemberHandler,
  deleteProjectHandler,
  getProjectByIdHandler,
  getProjectMembersHandler,
  getProjectsHandler,
  updateMemberRoleHandler,
  updateProjectHandler,
};
