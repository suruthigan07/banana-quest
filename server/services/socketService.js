let ioInstance = null;

export function setSocketServer(io) {
  ioInstance = io;
}

export function emitGameUpdate(roomCode, { leaderboard = false, event = "game:updated" } = {}) {
  if (!ioInstance || !roomCode) return;
  const payload = { roomCode: String(roomCode).toUpperCase(), updatedAt: new Date().toISOString() };
  ioInstance.to(`game:${payload.roomCode}`).emit(event, payload);
  if (leaderboard) ioInstance.to(`game:${payload.roomCode}`).emit("leaderboard:updated", payload);
}
