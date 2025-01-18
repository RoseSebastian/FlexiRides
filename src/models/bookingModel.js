import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "failed", "cancelled"],
    default: "confirmed",
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);
