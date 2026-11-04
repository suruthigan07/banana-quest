import crypto from "node:crypto";
import Game from "../models/Game.js";
import Question from "../models/Question.js";
import GameAnswer from "../models/GameAnswer.js";

export function makeRoomCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

export function streakBonus(streak) {
  if (streak >= 5) return 100;
  if (streak === 4) return 60;
  if (streak === 3) return 40;
  if (streak === 2) return 20;
  return 0;
}

export function calculateBasePoints(responseTimeMs, timeLimitSeconds) {
  const timeLimitMs = timeLimitSeconds * 1000;
  if (responseTimeMs >= timeLimitMs) return 0;
  const fractionRemaining = 1 - responseTimeMs / timeLimitMs;
  return Math.max(0, Math.floor(150 * fractionRemaining));
}

export async function getAnsweredUserIds(game, questionId) {
  const answers = await GameAnswer.find({
    gameId: game._id,
    questionId
  }).select("userId");
  return new Set(answers.map((answer) => answer.userId.toString()));
}

export async function serializeGame(game, currentUserId) {
  const plain = game.toObject ? game.toObject() : game;
  const players = plain.players
    .map((player) => ({
      userId: player.userId.toString(),
      username: player.username,
      avatar: player.avatar || "",
      score: player.score,
      currentStreak: player.currentStreak,
      longestStreak: player.longestStreak,
      isHost: player.userId.toString() === plain.hostId.toString()
    }))
    .sort((a, b) => b.score - a.score || a.username.localeCompare(b.username));

  let currentQuestion = null;
  let remainingMs = 0;
  let hasAnswered = false;
  let answeredCount = 0;

  if (plain.status === "active" && plain.currentQuestionIndex >= 0) {
    const questionId = plain.questionIds[plain.currentQuestionIndex];
    const question = await Question.findById(questionId).lean();

    if (question) {
      currentQuestion = {
        id: question._id,
        question: question.question,
        options: question.options,
        category: question.category,
        difficulty: question.difficulty,
        questionNumber: plain.currentQuestionIndex + 1,
        totalQuestions: plain.questionIds.length
      };
    }

    const start = new Date(plain.currentQuestionStartedAt).getTime();
    const limit = plain.questionTimeLimitSeconds * 1000;
    remainingMs = Math.max(0, limit - (Date.now() - start));

    const answeredIds = await getAnsweredUserIds(game, questionId);
    answeredCount = answeredIds.size;
    hasAnswered = answeredIds.has(currentUserId.toString());
  }

  return {
    id: plain._id,
    roomCode: plain.roomCode,
    status: plain.status,
    category: plain.category,
    hostId: plain.hostId.toString(),
    isHost: plain.hostId.toString() === currentUserId.toString(),
    players,
    playerCount: players.length,
    maxPlayers: plain.maxPlayers,
    questionTimeLimitSeconds: plain.questionTimeLimitSeconds,
    questionCount: plain.questionIds.length,
    currentQuestionIndex: plain.currentQuestionIndex,
    currentQuestion,
    remainingMs,
    hasAnswered,
    answeredCount,
    startedAt: plain.startedAt,
    finishedAt: plain.finishedAt
  };
}
