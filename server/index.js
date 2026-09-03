import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { authLimiter, generalLimiter } from "./middleware/rateLimiter.js";

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/posts", generalLimiter, postRoutes);
app.use("/api/admin", generalLimiter, adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is alive" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));