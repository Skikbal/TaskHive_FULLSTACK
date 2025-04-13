import Task from "../models/Task.model.js";
import uploadFilesToCloudinary from "../services/cloudinary.service.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import SubTask from "../models/Subtask.model.js";
// get all tasks
const getTasksHandler = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const allTasks = await Task.find({
    $or: [{ assignedBy: userId }, { assignedTo: userId }],
  });

  if (!allTasks) {
    throw new ApiError(404, "Tasks not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tasks fetched successfully", allTasks));
});

// get task by id
const getTaskByIdHandler = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Task fetched successfully", task));
});

// create task handler
const createTaskHandler = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { title, description, projectId, assignedToId, status } = req.body;

  // create task
  const newTask = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo: assignedToId,
    assignedBy: userId,
    status,
  });

  if (!newTask) {
    throw new ApiError(400, "Task creation failed");
  }

  const attachments = req.files.map((file) => file);

  if (attachments.length > 0) {
    const attachmentsUrls = await Promise.all(
      attachments.map((attachment) => uploadFilesToCloudinary(attachment)),
    );
    newTask.attachments.urls = attachmentsUrls.filter(Boolean); // filter out undefined or null uploaded files
    await newTask.save();
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Task created successfully", newTask));
});

// update task handler
const updateTaskHandler = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const taskId = req.params.taskId;
  const { title, description, projectId, assignedToId, status } = req.body;
  const attachments = req.files.map((file) => file);

  const updatedTask = await Task.findOneAndUpdate(
    { _id: taskId, assignedBy: userId },
    {
      $set: {
        title,
        description,
        project: projectId,
        assignedTo: assignedToId,
        status,
      },
    },
    { new: true },
  );
  if (!updatedTask) {
    throw new ApiError(
      400,
      "Task update failed or you are not authorized to update this task",
    );
  }

  if (attachments.length > 0) {
    const attachmentsUrls = await Promise.all(
      attachments.map((attachment) => uploadFilesToCloudinary(attachment)),
    );

    updatedTask.attachments.urls = attachmentsUrls.filter(Boolean);
  }
  await updatedTask.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Task updated successfully", updatedTask));
});

// delete task
const deleteTaskHandler = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const deletedTask = await Task.findByIdAndDelete(taskId).select("_id");

  if (!deletedTask) {
    throw new ApiError(404, "task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "task deleted successfully", deletedTask));
});

// create subtask
const createSubTaskHandler = async (req, res) => {
  const userId = req.user._id;
  const { taskId, title } = req.body;

  const newSubTask = await SubTask.create({
    title,
    task: taskId,
    createdBy: userId,
  });

  if (!newSubTask) {
    throw new ApiError(400, "Subtask creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Subtask created successfully", newSubTask));
};

// update subtask
const updateSubTaskHandler = async (req, res) => {
  const { subTaskId } = req.params;
  const { title, isCompleted } = req.body;
  const updatedSubTask = await SubTask.findByIdAndUpdate(
    { _id: subTaskId },
    {
      $set: {
        title,
        isCompleted,
      },
    },
    {
      new: true,
    },
  );
  console.log(updatedSubTask);
  if (!updatedSubTask) {
    throw new ApiError(400, "Subtask update failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subtask updated successfully", updatedSubTask));
};

// delete subtask
const deleteSubTaskHandler = async (req, res) => {
  const subTaskId = req.params.subTaskId;

  const deletedSubTask = await SubTask.findByIdAndDelete(subTaskId).select(
    "_id",
  );

  if (!deletedSubTask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subtask deleted successfully", deletedSubTask));  
};

export {
  createSubTaskHandler,
  createTaskHandler,
  deleteSubTaskHandler,
  deleteTaskHandler,
  getTaskByIdHandler,
  getTasksHandler,
  updateSubTaskHandler,
  updateTaskHandler,
};
