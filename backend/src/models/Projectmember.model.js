import mongoose, { Schema } from "mongoose";
import { availableUserRoles, UserRolesEnum } from "../constants/constant.js";
import { ApiError } from "../utils/api-error.js";
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

//validate role
projectMemberSchema.statics.validateRoleForProjectUpdate = async function (
  projectId,
  userId,
) {
  const memberRole = await this.findOne({
    project: projectId,
    user: userId,
  }).select("role");
  if (
    !memberRole ||
    (memberRole.role !== UserRolesEnum.ADMIN &&
      memberRole.role !== UserRolesEnum.PROJECT_ADMIN)
  ) {
    throw new ApiError(
      403,
      "You are not authorized to perform this action or project not found",
    );
  }
  return memberRole;
};

const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);

export default ProjectMember;
