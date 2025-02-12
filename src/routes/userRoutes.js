import express from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  getLoggedInUser,
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  changePassword,
  forgotPassword,
  toggleUserStatus,
  resetPassword
} from "../controllers/userController.js";
import { userAuth } from "../middlewares/userAuth.js";
import { adminAuth } from "../middlewares/adminAuth.js"

const router = express.Router();

router.post("/register", userRegister);

router.put("/login", userLogin);

router.get("/currentUser", userAuth, getLoggedInUser);

router.get("/profile/:id", userAuth, getUserById);

router.get("/allUsers", userAuth, getAllUsers);

router.put("/update", userAuth, updateProfile);

router.put("/status/:id", adminAuth, toggleUserStatus);

router.delete("/delete/:id", userAuth, deleteUser);

router.get("/logout", userAuth, userLogout);

router.put("/changePassword", userAuth, changePassword);

router.put("/forgotPassword", forgotPassword);

router.post("/resetPassword", resetPassword);

//check-user

export { router as userRouter };
