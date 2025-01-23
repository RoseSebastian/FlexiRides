import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    maxLength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
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
  },
  role: {
    type: String,
    enum: ["admin", "dealer", "user"],
    default: "mentor",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const Admin = mongoose.model("Admin", adminSchema);
