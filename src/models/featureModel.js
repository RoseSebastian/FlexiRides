import mongoose, { Schema } from "mongoose";

const featureSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Feature = mongoose.model("Features", featureSchema);
