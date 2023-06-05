import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";
import bycrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Name is required"],
      maxLength: [50, "Name must be less than 50 chars"],
    },
    email: {
      type: String,
      required: ["true", "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password nust be atleast 8 chars"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

//Encript the Password before saving: HOOKS

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bycrypt.hash(this.password, 10); //10 is a salt value
  next();
});

userSchema.methods = {
  //compare password
  comparePassword: async function (enteredPassword) {
    return await bycrypt.compare(enteredPassword, this.password);
  },
};

export default mongoose.model("User", userSchema);
