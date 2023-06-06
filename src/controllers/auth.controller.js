// sign up the user
import User from "../models/user.schema.js";
import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";

export const cookieOption = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

export const signup = asyncHandler(async (req, res, next) => {
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
