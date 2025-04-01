import mongoose, { Schema } from "mongoose";
import { availableUserRoles, UserRolesEnum } from "../constants/constant.js";

const projectMemberSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  role: {
    type: String,
    enum: availableUserRoles,
    default: UserRolesEnum.MEMBER,
  },
});

const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);

export default ProjectMember;
