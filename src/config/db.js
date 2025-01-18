import mongoose from "mongoose";

const db_link = process.env.DB_LINK;

export const connectDB = async () => {
  try {
    await mongoose.connect(db_link);
    console.log("DB connected successfully");
  } catch (err) {
    console.error("Error connecting to DB:", err.message);
  }
};