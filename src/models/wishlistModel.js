import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
