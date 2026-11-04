import mongoose from "mongoose";

const gameAnswerSchema = new mongoose.Schema(
  {
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    selectedAnswerIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    responseTimeMs: { type: Number, required: true },
    basePoints: { type: Number, default: 0 },
    bonusPoints: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    streakAfterAnswer: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// One answer per player per question, even if the client submits twice.
gameAnswerSchema.index(
  { gameId: 1, userId: 1, questionId: 1 },
  { unique: true }
);

export default mongoose.model("GameAnswer", gameAnswerSchema);
