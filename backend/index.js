import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRouter from "./routes/todoRoutes.js";

const app = express();
app.use(express.json());

const allowedOrigins = [
    "http://localhost:3000", // Local frontend
    "https://todo-assignment-frontend-git-main-vaidyavaishalis-projects.vercel.app/" // Vercel frontend
  ];
  
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
      credentials: true // Allow cookies/auth headers if needed
    })
  );
  
// app.use(
//     cors({
//       origin: "", // Front-end origin
//       methods: ['GET', 'POST'], // Allowed methods
//       credentials: true, // Allow cookies or credentials
//     })
//   );dotenv.config();

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