import express from "express";
import {
  adminRegister,
  adminLogin,
  adminLogout,
  getLoggedInUser,
  getAllAdmins,
  getUserById,
  updateProfile,
  deleteAdmin,
  changePassword,
  forgotPassword,
  toggleAdminStatus
} from "../controllers/adminController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/register", adminRegister);

router.put("/login", adminLogin);

router.get("/profile", adminAuth, getLoggedInUser);

router.get("/profile/:id", adminAuth, getUserById);

router.get("/allAdmins", adminAuth, getAllAdmins);

router.put("/update", adminAuth, updateProfile);

router.put("/status/:id", adminAuth, toggleAdminStatus);

router.delete("/delete/:id", adminAuth, deleteAdmin);

router.get("/logout", adminAuth, adminLogout);

router.put("/changePassword", adminAuth, changePassword);

router.put("/forgotPassword", forgotPassword);

export { router as adminRouter };
