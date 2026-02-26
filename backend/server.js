import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import learnRoutes from "./routes/learnRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import adaptiveRoutes from "./routes/adaptiveRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

config();
connectDB();

const app = express();

app.use(cors());
app.use(json());

import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);
app.use("/api/learn", learnRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/adaptive", adaptiveRoutes);
app.use("/api/analytics", analyticsRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});