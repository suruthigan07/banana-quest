import crypto from "node:crypto";
import Game from "../models/Game.js";
import Question from "../models/Question.js";
import GameAnswer from "../models/GameAnswer.js";
import User from "../models/User.js";

export function makeRoomCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

/**
 * THEME: GAME MECHANICS & EVENT SCORING
 * Banana Streak Multipliers encourage fast, accurate calculations
 */
export function streakBonus(streak) {
  if (streak >= 5) return 150; // ULTRA BANANA FRENZY
  if (streak === 4) return 100;
  if (streak === 3) return 60;
  if (streak === 2) return 30;
  return 0;
}

export function calculateBasePoints(responseTimeMs, timeLimitSeconds) {
  const timeLimitMs = timeLimitSeconds * 1000;
  if (responseTimeMs >= timeLimitMs) return 10;
  const fractionRemaining = Math.max(0, 1 - responseTimeMs / timeLimitMs);
  // Base 100 pts + up to 100 speed bonus pts
  return Math.max(10, Math.floor(100 + 100 * fractionRemaining));
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
  const players = (plain.players || [])
    .map((player) => ({
      userId: player.userId.toString(),
      username: player.username,
      avatar: player.avatar || "banana-warrior",
      title: player.title || "Banana Novice",
      score: player.score || 0,
      currentStreak: player.currentStreak || 0,
      longestStreak: player.longestStreak || 0,
      correctAnswers: player.correctAnswers || 0,
      isHost: player.userId.toString() === plain.hostId.toString()
    }))
    .sort((a, b) => b.score - a.score || a.username.localeCompare(b.username));

  let currentQuestion = null;
  let remainingMs = 0;
  let hasAnswered = false;
  let answeredCount = 0;

  if (plain.status === "active" && plain.currentQuestionIndex >= 0 && plain.questionIds?.length) {
    const questionId = plain.questionIds[plain.currentQuestionIndex];
    const question = await Question.findById(questionId).lean();

    if (question) {
      currentQuestion = {
        id: question._id,
        question: question.question,
        options: question.options || ["0","1","2","3","4","5","6","7","8","9"],
        category: question.category,
        difficulty: question.difficulty,
        questionType: question.questionType || (question.imageUrl ? "banana" : "trivia"),
        imageUrl: question.imageUrl || "",
        questionNumber: plain.currentQuestionIndex + 1,
        totalQuestions: plain.questionIds.length
      };
    }

    const start = new Date(plain.currentQuestionStartedAt || Date.now()).getTime();
    const limit = (plain.questionTimeLimitSeconds || 15) * 1000;
    remainingMs = Math.max(0, limit - (Date.now() - start));

    const answeredIds = await getAnsweredUserIds(game, questionId);
    answeredCount = answeredIds.size;
    hasAnswered = currentUserId ? answeredIds.has(currentUserId.toString()) : false;
  }

  return {
    id: plain._id,
    roomCode: plain.roomCode,
    status: plain.status,
    category: plain.category,
    mode: plain.mode || "banana",
    isSolo: plain.isSolo || plain.players?.length === 1,
    hostId: plain.hostId.toString(),
    isHost: currentUserId ? plain.hostId.toString() === currentUserId.toString() : false,
    players,
    playerCount: players.length,
    maxPlayers: plain.maxPlayers,
    questionTimeLimitSeconds: plain.questionTimeLimitSeconds,
    questionCount: plain.questionIds ? plain.questionIds.length : 0,
    currentQuestionIndex: plain.currentQuestionIndex,
    currentQuestion,
    remainingMs,
    hasAnswered,
    answeredCount,
    startedAt: plain.startedAt,
    finishedAt: plain.finishedAt
  };
}

/**
 * Finalize player career statistics and rewards when game completes
 */
export async function finalizeGameStats(game) {
  if (!game || !game.players || !game.players.length) return;

  const winner = [...game.players].sort((a, b) => b.score - a.score)[0];

  for (const player of game.players) {
    try {
      const isWinner = winner && winner.userId.toString() === player.userId.toString();
      const bonusCoins = Math.floor(player.score / 10) + (isWinner ? 50 : 10);

      const user = await User.findById(player.userId);
      if (user) {
        user.gamesPlayed = (user.gamesPlayed || 0) + 1;
        user.totalPoints = (user.totalPoints || 0) + player.score;
        user.bananaCoins = (user.bananaCoins || 0) + bonusCoins;
        user.highestStreak = Math.max(user.highestStreak || 0, player.longestStreak || 0);

        if (isWinner) {
          user.gamesWon = (user.gamesWon || 0) + 1;
        }

        // Award dynamic badges
        const badges = new Set(user.badges || ["Banana Rookie"]);
        if (user.gamesPlayed >= 5) badges.add("Banana Veteran");
        if (user.gamesPlayed >= 20) badges.add("Jungle Master");
        if (user.gamesWon >= 1) badges.add("First Victory");
        if (user.gamesWon >= 5) badges.add("Banana Champion");
        if (user.highestStreak >= 5) badges.add("Streak God");
        if (user.totalPoints >= 1000) badges.add("Points Millionaire");

        user.badges = Array.from(badges);

        // Update rank title based on total points
        if (user.totalPoints >= 3000) user.title = "Grand Banana King 👑";
        else if (user.totalPoints >= 1500) user.title = "Cyber Ape Overlord 🚀";
        else if (user.totalPoints >= 700) user.title = "Banana Sensei 🥋";
        else if (user.totalPoints >= 300) user.title = "Jungle Explorer 🌴";
        else user.title = "Banana Novice 🍌";

        await user.save();
      }
    } catch (err) {
      console.error(`Failed to update stats for user ${player.userId}:`, err.message);
    }
  }
}
