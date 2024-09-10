import mongoose from "mongoose";
import { UserType } from "../shared/types";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: false },
    status: { type: Boolean, required: false, default: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    phone: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserType>("User", userSchema);

export default User;
