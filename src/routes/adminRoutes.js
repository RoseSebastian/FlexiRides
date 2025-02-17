import express from "express";
import {
  adminRegister,
  adminLogin,
  adminLogout,
  getLoggedInUser,
  getAllDealers,
  getAllAdmins,
  getUserById,
  updateProfile,
  deleteAdmin,
  changePassword,
  forgotPassword,
  toggleAdminStatus,
  resetPassword,
  getAllUsers,
  getAllAdminsAndUsers,
  toggleUserStatus,
  editProfile,
  addAdmin
} from "../controllers/adminController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/register", adminRegister);

router.post("/add", addAdmin);

router.put("/login", adminLogin);

router.get("/currentUser", adminAuth, getLoggedInUser);

router.get("/profile/:id", adminAuth, getUserById);

router.put("/edit/:id", adminAuth, editProfile);

router.get("/allDealers", adminAuth, getAllDealers);

router.get("/allAdmins", adminAuth, getAllAdmins);

router.get("/allUsers", adminAuth, getAllUsers);

router.get("/allAdminAndUsers", adminAuth, getAllAdminsAndUsers);

router.put("/update", adminAuth, updateProfile);

router.put("/adminStatus/:id", adminAuth, toggleAdminStatus);

router.put("/userStatus/:id", adminAuth, toggleUserStatus);

router.delete("/delete/:id", adminAuth, deleteAdmin);

router.get("/logout", adminAuth, adminLogout);

router.put("/changePassword", adminAuth, changePassword);

router.put("/forgotPassword", forgotPassword);

router.post("/resetPassword", resetPassword);

export { router as adminRouter };
