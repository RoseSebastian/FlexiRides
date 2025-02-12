import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  cancelBooking,
  getBookingsByCarID
} from "../controllers/bookingController.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// Booking routes
router.post("/", userAuth, createBooking);
router.get("/allBookings", adminAuth, getAllBookings);
router.get("/", userAuth, getBookings);
router.get("/car/:id", getBookingsByCarID);
router.get("/:id", getBookingById);
router.put("/:id", adminAuth, updateBooking);
router.delete("/:id", adminAuth, deleteBooking);
router.patch("/:id", userAuth, cancelBooking);

export { router as bookingRouter };
