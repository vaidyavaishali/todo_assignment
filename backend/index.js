import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRouter from "./routes/todoRoutes.js";

const app = express();
app.use(express.json());
app.use(
    cors({
      origin: "https://localhost:3000", // Front-end origin
      methods: ['GET', 'POST'], // Allowed methods
      credentials: true, // Allow cookies or credentials
    })
  );dotenv.config();

//connect to mongodb
mongoose.connect(process.env.mongodb_url).then(() => {
        console.log("Connected To DB")
    })
    .catch((err) => {
        console.log(err.message);
    })
    app.use("/", todoRouter)

    app.listen(process.env.PORT, () => {
        console.log("Server is running on port 5000")
    })