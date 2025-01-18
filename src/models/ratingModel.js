import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
});

export const Rating = mongoose.model("Rating", ratingSchema);
