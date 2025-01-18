import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import { connectDB } from "./src/config/db.js";
import { apiRouter } from "./src/routes/index.js";

const port = process.env.PORT;
const app = express()
app.use(express.json())
app.use(cookieParser())

connectDB();

app.get("/", (req, res) => {
    res.send("API is live");
})

app.use("/api", apiRouter);

app.listen(port, ()=>{
    console.log(`Running on http://localhost:${port}`)
})