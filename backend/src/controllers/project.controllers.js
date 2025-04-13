import { asyncHandler } from "../utils/async-handler.js";
import Project from "../models/Project.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import ProjectMember from "../models/Projectmember.model.js";
import { User } from "../models/User.model.js";

const getProjectsHandler = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const projects = await Project.aggregate([
    {
      $match: {
        createdBy: _id,
      },
    },
  ]);

  if (!projects) {
    throw new ApiError(404, "Projects not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Projects fetched successfully", projects));
});

const getProjectByIdHandler = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById({
    _id: projectId,
  });
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Project fetched successfully", project));
});

//create project handler
const createProjectHandler = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const _id = req.user._id;

  const project = await Project.create({
    name,
    description,
    createdBy: _id,
  });

  if (!project) {
    throw new ApiError(400, "Project creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Project created successfully", project));
});

//update project handler
const updateProjectHandler = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  const updatedProject = await Project.findByIdAndUpdate(
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
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Project updated", updatedProject));
});

const deleteProjectHandler = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const deletedProject = await Project.findByIdAndDelete(projectId);

  if (!deletedProject) {
    throw new ApiError(404, "Project not found");
  }

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

  //check if user is admin or project admin
  const user = await User.findById(userId).select("role");
  if (user.role !== "admin" || user.role !== "project_admin") {
    throw new ApiError(
      403,
      "You are not authorized to add members to this project",
    );
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
  const { memberId } = req.params;
  const userId = req.user._id;
  //check if user is admin or project admin
  const user = await User.findById(userId).select("role");
  if (user.role !== "admin" || user.role !== "project_admin") {
    throw new ApiError(
      403,
      "You are not authorized to delete members from this project",
    );
  }

  const deletedMember = await ProjectMember.findByIdAndDelete(memberId);

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
