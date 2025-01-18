import mongoose, { Schema } from "mongoose";

const featureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Feature = mongoose.model("Rating", featureSchema);
