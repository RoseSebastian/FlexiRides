import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["confirmed", "failed", "canceled"],
    default: "confirmed",
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);
