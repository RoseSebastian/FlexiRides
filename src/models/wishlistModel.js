import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema({
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
  noOfDays: {
    type: Number,
    required: true
  },
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
