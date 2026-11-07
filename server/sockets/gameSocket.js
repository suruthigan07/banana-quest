import jwt from "jsonwebtoken";
import Game from "../models/Game.js";
import User from "../models/User.js";
import { setSocketServer } from "../services/socketService.js";

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    if (key === name) return decodeURIComponent(part.slice(index + 1).trim());
  }
  return null;
}

/**
 * THEME: EVENT-DRIVEN PROGRAMMING
 * Real-time duplex WebSocket architecture using Socket.IO.
 * Dispatches and listens for asynchronous game room lifecycle events,
 * live player reactions, dynamic answer signals, and leaderboard mutations.
 */
export function configureGameSockets(io) {
  setSocketServer(io);

  io.use(async (socket, next) => {
    try {
      const token = readCookie(socket.handshake.headers.cookie, "quiz_token");
      if (!token) return next(new Error("Authentication required. Please log in."));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.sub).select("_id username avatar title");
      if (!user) return next(new Error("Account not found."));
      socket.user = user;
      next();
    } catch {
      next(new Error("Your session is invalid or expired."));
    }
  });

  io.on("connection", (socket) => {
    // Event: Player joins a room channel
    socket.on("room:join", async (rawRoomCode, callback) => {
      try {
        const roomCode = String(rawRoomCode || "").trim().toUpperCase();
        if (!/^[A-F0-9]{6}$/.test(roomCode)) {
          return callback?.({ ok: false, message: "Invalid room code." });
        }
        const game = await Game.findOne({ roomCode }).select("players");
        const isMember = game?.players.some(
          (player) => player.userId.toString() === socket.user._id.toString()
        );
        if (!isMember) return callback?.({ ok: false, message: "You are not a player in this room." });

        // Unsubscribe from any previous rooms
        for (const joinedRoom of socket.rooms) {
          if (joinedRoom.startsWith("game:") && joinedRoom !== `game:${roomCode}`) {
            socket.leave(joinedRoom);
          }
        }
        socket.join(`game:${roomCode}`);
        callback?.({ ok: true, roomCode });
      } catch (error) {
        console.error("Socket room join error:", error);
        callback?.({ ok: false, message: "Could not join the live room." });
      }
    });

    // Event: Live player reaction (e.g. 🍌, 🔥, 🚀, 👑, 😱)
    socket.on("reaction:send", ({ roomCode, emoji }) => {
      if (!roomCode || !emoji) return;
      const cleanCode = String(roomCode).trim().toUpperCase();
      io.to(`game:${cleanCode}`).emit("reaction:received", {
        emoji,
        userId: socket.user._id,
        username: socket.user.username,
        avatar: socket.user.avatar || "banana-warrior",
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      });
    });

    // Event: Player submitted an answer signal
    socket.on("answer:submitted", ({ roomCode }) => {
      if (!roomCode) return;
      const cleanCode = String(roomCode).trim().toUpperCase();
      socket.to(`game:${cleanCode}`).emit("player:answered", {
        userId: socket.user._id,
        username: socket.user.username
      });
    });
  });
}
