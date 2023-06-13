// sign up the user

import User from "../models/user.schema.js";
import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";
import mailHelper from "../utils/mailHelper.js";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/******************************************************
 * @SIGNUP
 * @route http://localhost:4000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @returns User Object
 ******************************************************/

export const signUp = asyncHandler(async (req, res, next) => {
  // get data from user
  const { name, email, password } = req.body;

  //   validation
  if (!name || !email || !password) {
    throw new CustomError("Please ass all the fields", 400);
  }
  // Check if user already is there or not.
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError("User is already there", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJWTtoken();

  // safty
  user.password = undefined;

  // store this token in user's cookie
  res.cookie("token", token, cookieOption);

  // send nack a resposnse to user
  res.status(200).json({
    success: true,
    token,
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    throw new CustomError("please Fill the details", 400);
  }
  const user = User.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (isPasswordMatched) {
    const token = user.getJWTtoken();
    user.password = undefined;
    res.cookie("token", token, cookieOption);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }
  throw new CustomError("Password is incorrect", 400);
});
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;

  if (!user) {
    throw new CustomError("user not fount", 401);
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = asyncHandler(async (res, req) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError("email not fount", 404);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("user not fount", 404);
  }

  const resetToken = user.generateForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/password/reset/${resetToken}`;

  const message = `your password reset token is as follows \n\n ${resetUrl} \n\n if this was not requested by you, please ignore.`;

  try {
    const options = {};
    await mailHelper({
      email: user.email,
      subject: "Password reset mail",
      message,
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new CustomError(error.message || "Email coud not be sent", 500);
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token: resetToken } = req.params;

  const { password, confirmPassword } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new CustomError("password reset token is invalid or expired", 400);
  }

  if (password !== confirmPassword) {
    throw new CustomError("password does not match", 400);
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  // optional

  const token = user.getJWTtoken();
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    user,
  });
});
