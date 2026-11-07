import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    avatar: { type: String, default: "banana-warrior" },
    title: { type: String, default: "Banana Novice" },
    score: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const gameSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, unique: true, uppercase: true, index: true },
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    players: { type: [playerSchema], default: [] },
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    category: { type: String, default: "Banana API" },
    mode: { type: String, enum: ["banana", "trivia", "speedrun"], default: "banana" },
    isSolo: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["waiting", "active", "completed"],
      default: "waiting"
    },
    currentQuestionIndex: { type: Number, default: -1 },
    currentQuestionStartedAt: { type: Date, default: null },
    questionTimeLimitSeconds: { type: Number, default: 15 },
    maxPlayers: { type: Number, default: 8, min: 1, max: 20 },
    startedAt: { type: Date, default: null },
    finishedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

gameSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Game", gameSchema);
