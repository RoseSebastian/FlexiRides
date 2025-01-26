import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carId: {
    type: Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Review = mongoose.model("Review", ratingSchema);
