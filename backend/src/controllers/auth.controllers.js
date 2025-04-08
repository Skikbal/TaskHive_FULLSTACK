import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/api-error.js";
import uploadFilesToCloudinary from "../services/cloudinary.service.js";
import {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
} from "../services/mail.service.js";
import { ApiResponse } from "../utils/api-response.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

//register user
const registerUserHandler = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  //creating user
  const newUser = await User.create({
    username: username.toLowerCase(),
    email,
    fullname,
    password,
  });

  if (!newUser) {
    throw new ApiError(500, "Failed to create user");
  }

  //get the avatar local path url
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (avatarLocalPath) {
    const avatar = await uploadFilesToCloudinary(avatarLocalPath);
    newUser.avatar = {
      url: avatar?.url ?? "",
      localpath: avatarLocalPath ?? "",
    };
  }

  //genrate email verification token
  const emailVerificationToken = newUser.generateEmailVerificationToken();
  await newUser.save();

  //finding user with username and email
  const user = await User.findOne(
    { _id: newUser._id },
    { username: 1, email: 1, fullname: 1 },
  );

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //send verification email
  const verificationURL = `${process.env.BASEURL}/auth/verify-email?token=${emailVerificationToken}`;
  await sendEmail({
    email: user.email,
    subject: "Verify your email address",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      verificationURL,
    ),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", user));
});

//user login handler
const loginUserHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found !");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(401, "User not verified !");
  }

  const isPasswordMatched = await user.isPasswordCorrect(password);

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid user credentials !");
  }

  const accesstoken = user.generateAccesToken();
  const refreshtoken = user.generateRefreshToken();

  user.refreshToken = refreshtoken;
  await user.save();

  const userData = await User.findById(user._id).select(
    "-password -emailVerificationToken -emailVerificationExpiry -refreshToken -forgotPasswordToken -forgotPasswordExpiry",
  );

  const cookieOption = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accesstoken", accesstoken, cookieOption)
    .cookie("refreshtoken", refreshtoken, cookieOption)
    .json(new ApiResponse(200, "User logged in successfully", userData));
});

//user logout handler
const logoutUserHandler = asyncHandler(async (req, res) => {
  //user find karo req.user se jo is auth middleware se mil raha hai
  //user ko find karo and update karo refresh token ""
  //response bhejdo cookie blank set karke
  const id = req.user._id;
  await User.findById(id).updateOne({ refreshToken: "" });
  return res
    .cookie("accesstoken", "")
    .cookie("refreshtoken", "")
    .json(new ApiResponse(200, "User logged out successfully"));
});

//verify email
const verifyEmailHandler = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    $and: [
      { emailVerificationToken: hashedToken },
      { emailVerificationExpiry: { $gt: Date.now() } },
    ],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Email verified successfully"));
});

//resend email verification handler
const resendEmailVerificationHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const emailVerificationToken = user.generateEmailVerificationToken();
  await user.save();

  //send verification email
  const verificationURL = `${process.env.BASEURL}/auth/verify-email?token=${emailVerificationToken}`;

  await sendEmail({
    email: user.email,
    subject: "Verify your email address",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      verificationURL,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Email verification link sent successfully"));
});

//refresh access token handler
const refreshAccessTokenHandler = asyncHandler(async (req, res) => {
  const { refreshtoken } = req.cookies;

  if (!refreshtoken) {
    throw new ApiError(401, "Refresh token missing. Unauthorized.");
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.refreshToken !== refreshtoken) {
    throw new ApiError(
      403,
      "Refresh token does not match. Possible token reuse detected.",
    );
  }

  //rotate the refresh and access token
  const accessToken = user.generateAccesToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();
  // req.user = user;

  const cookieOption = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
  return res
    .cookie("accesstoken", accessToken, cookieOption)
    .cookie("refreshtoken", refreshToken, cookieOption)
    .json(
      new ApiResponse(
        200,
        "Token refreshed successfully. Please use the new tokens",
      ),
    );
});

//forgot password request handler
const forgotPasswordRequestHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const passwordResetToken = user.generateForgotPasswordToken();
  await user.save();

  const resetPasswordURL = `${process.env.BASEURL}/auth/reset-password?token=${passwordResetToken}`;
  //send reset password email
  await sendEmail({
    email: user.email,
    subject: "Reset your password",
    mailgenContent: forgotPasswordMailgenContent(
      user.username,
      resetPasswordURL,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset link sent successfully"));
});

//reset password request handler
const resetForgottenPasswordHandler = asyncHandler(async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.query;
  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match");
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    $and: [
      { forgotPasswordToken: hashedToken },
      { forgotPasswordExpiry: { $gt: Date.now() } },
    ],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully"));
});

const changeCurrentPasswordHandler = asyncHandler(async (req, res) => {
  const { password, newpassword, confirmpassword } = req.body;
  if (newpassword !== confirmpassword) {
    throw new ApiError(400, "Password and confirm password do not match");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isOldPasswordMatched = await user.isPasswordCorrect(password);
  if (!isOldPasswordMatched) {
    throw new ApiError(401, "Invalid user credentials");
  }

  user.password = newpassword;
  await user.save(); //save the new password
  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});

//get current user handler
const getCurrentUserHandler = asyncHandler(async (req, res) => {
  const _id = req.user._id;
  const user = await User.findById(_id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, "User found", user));
});

export {
  changeCurrentPasswordHandler,
  forgotPasswordRequestHandler,
  getCurrentUserHandler,
  loginUserHandler,
  logoutUserHandler,
  refreshAccessTokenHandler,
  registerUserHandler,
  resendEmailVerificationHandler,
  resetForgottenPasswordHandler,
  verifyEmailHandler,
};
