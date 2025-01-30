import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { connectDB } from "./src/config/db.js";
import { apiRouter } from "./src/routes/index.js";
import cloudinaryConfig from "./src/config/cloudinary.js";
import errorHandler from "./src/middlewares/errorhandler.js";

const port = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: process.env.WEB_URL, // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  })
);
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(express.json());
app.use(cookieParser());

connectDB();
cloudinaryConfig();

app.get("/", (req, res) => {
  res.send("API is live");
});

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
