import mongoose, { Schema } from "mongoose";

const carSchema = new Schema({
  model: {
    type: String,
    required: true,
    maxLength: 20,
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 15,
  },
  bodyType: {
    type: String,
    required: true,
    enum: ["sedan", "hatchback", "suv"],
    maxLength: 10,
  },
  fuelType: {
    type: String,
    required: true,
    enum: ["petrol", "diesel", "electric"],
    minLength: 3,
  },
  transmission: {
    type: String,
    required: true,
    enum: ["manual", "automatic"],
    maxLength: 10,
  },
  year: {
    type: Number,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  features: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Features",
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const Car = mongoose.model("Car", carSchema);
