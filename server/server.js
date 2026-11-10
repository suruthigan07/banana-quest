import "./config/loadEnv.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { configureGameSockets } from "./sockets/gameSocket.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

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

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (origin === process.env.CLIENT_URL) return true;
  // Allow localhost or 127.0.0.1 with any port (5173, 5174, 5175, 3000, etc.)
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS origin not allowed: " + origin));
    }
  },
  credentials: true
};

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "quiz-battle-auth-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: corsOptions,
  transports: ["websocket", "polling"]
});
configureGameSockets(io);

const server = httpServer.listen(PORT, () => console.log(`Backend and Socket.IO running on port ${PORT}`));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected.");
  })
  .catch((error) => {
    console.warn("MongoDB connection notice (server running with fallback data):", error.message);
  });
