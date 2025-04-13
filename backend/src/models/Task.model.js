import mongoose, { Schema } from "mongoose";
import { availableTaskStatus, TaskStatusEnum } from "../constants/constant.js";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: availableTaskStatus,
      default: TaskStatusEnum.TODO,
    },
    attachments: {
      urls: {
        type: [
          {
            url: {
              type: String,
              required: true,
              trim: true,
            },
            mimeType: { type: String },
            size: { type: Number },
          },
        ],
        default: [],
      },
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
