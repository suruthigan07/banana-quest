import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";

const required = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must contain at least 32 characters.");
  process.exit(1);
}

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "quiz-battle-auth-api" });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected.");
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
