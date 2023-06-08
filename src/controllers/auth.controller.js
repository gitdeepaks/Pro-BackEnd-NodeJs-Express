// sign up the user
import User from "../models/user.schema.js";
import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";

export const cookieOption = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

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
