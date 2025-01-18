import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    maxLength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  phone: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: false
  },
  address: {
    type: String,
    maxLength: 100,
  },
  role: {
    type: String,
    enum: ["admin", "dealer", "user"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const User = mongoose.model("User", userSchema);
