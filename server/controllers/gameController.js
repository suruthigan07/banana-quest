import Game from "../models/Game.js";
import Question from "../models/Question.js";
import GameAnswer from "../models/GameAnswer.js";
import { emitGameUpdate } from "../services/socketService.js";
import {
  fetchBananaPuzzlesBatch,
  formatBananaAsQuestion
} from "../services/bananaApiService.js";
import {
  makeRoomCode,
  calculateBasePoints,
  streakBonus,
  serializeGame,
  finalizeGameStats
} from "../services/gameService.js";

const allowedQuestionCounts = [1, 2, 3, 5, 10, 15];
const allowedTimeLimits = [10, 15, 20, 30];

async function findGame(roomCode) {
  return Game.findOne({ roomCode: String(roomCode).trim().toUpperCase() });
}

function isPlayer(game, userId) {
  return game.players.some((player) => player.userId.toString() === userId.toString());
}

function isHost(game, userId) {
  return game.hostId.toString() === userId.toString();
}

/**
 * THEME: INTEROPERABILITY & DISTRIBUTED ARCHITECTURE
 * Creates a new Game Room. If "Banana API" is selected (default), it invokes the external
 * Marc Conrad Banana API service to fetch fresh equation puzzles.
 */
export async function createGame(req, res) {
  try {
    const questionCount = Number(req.body.questionCount || 5);
    const maxPlayers = Number(req.body.maxPlayers || 8);
    const timeLimit = Number(req.body.timeLimitSeconds || 15);
    const category = String(req.body.category || "Banana API").trim();
    const mode = String(req.body.mode || (category === "Banana API" ? "banana" : "trivia")).trim();
    const isSolo = maxPlayers === 1 || Boolean(req.body.isSolo);

    if (!allowedQuestionCounts.includes(questionCount)) {
      return res.status(400).json({ message: "Choose 1, 2, 3, 5, 10, or 15 questions." });
    }
    if (!Number.isInteger(maxPlayers) || maxPlayers < 1 || maxPlayers > 20) {
      return res.status(400).json({ message: "Players must be between 1 and 20." });
    }
    if (!allowedTimeLimits.includes(timeLimit)) {
      return res.status(400).json({ message: "Choose a 10, 15, 20, or 30 second timer." });
    }

    let questionIds = [];

    if (category === "Banana API" || mode === "banana") {
      // Interoperability in action: fetch live puzzles from external Banana API
      const puzzles = await fetchBananaPuzzlesBatch(questionCount);
      const questionDocs = await Question.insertMany(
        puzzles.map((p, idx) => formatBananaAsQuestion(p, idx + 1))
      );
      questionIds = questionDocs.map((doc) => doc._id);
    } else {
      const filter = { isActive: true };
      if (category !== "Mixed") filter.category = category;

      let questions = await Question.aggregate([
        { $match: filter },
        { $sample: { size: questionCount } },
        { $project: { _id: 1 } }
      ]);

      if (questions.length < questionCount) {
        // Fallback to Banana API questions if database has insufficient trivia questions
        const puzzles = await fetchBananaPuzzlesBatch(questionCount);
        const questionDocs = await Question.insertMany(
          puzzles.map((p, idx) => formatBananaAsQuestion(p, idx + 1))
        );
        questionIds = questionDocs.map((doc) => doc._id);
      } else {
        questionIds = questions.map((item) => item._id);
      }
    }

    let roomCode;
    let game;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      roomCode = makeRoomCode();
      try {
        game = await Game.create({
          roomCode,
          hostId: req.user._id,
          players: [{
            userId: req.user._id,
            username: req.user.username,
            avatar: req.user.avatar || "banana-warrior",
            title: req.user.title || "Banana Novice"
          }],
          questionIds,
          category,
          mode,
          isSolo,
          maxPlayers,
          questionTimeLimitSeconds: timeLimit
        });
        break;
      } catch (error) {
        if (error.code !== 11000 || attempt === 4) throw error;
      }
    }

    emitGameUpdate(game.roomCode);
    return res.status(201).json({
      message: isSolo ? "Solo Banana Quest started." : "Game room created.",
      game: await serializeGame(game, req.user._id)
    });
  } catch (error) {
    console.error("Create game error:", error);
    return res.status(500).json({ message: "Could not create the game room." });
  }
}

export async function joinGame(req, res) {
  try {
    const game = await findGame(req.params.roomCode);
    if (!game) return res.status(404).json({ message: "Room not found." });
    if (game.status !== "waiting") {
      if (isPlayer(game, req.user._id)) {
        return res.json({ message: "You are already in this game.", game: await serializeGame(game, req.user._id) });
      }
      return res.status(409).json({ message: "This game has already started." });
    }
    if (isPlayer(game, req.user._id)) {
      return res.json({ message: "You are already in this room.", game: await serializeGame(game, req.user._id) });
    }
    if (game.players.length >= game.maxPlayers) {
      return res.status(409).json({ message: "This room is full." });
    }

    game.players.push({
      userId: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar || "banana-warrior",
      title: req.user.title || "Banana Novice"
    });
    await game.save();
    emitGameUpdate(game.roomCode);

    return res.json({
      message: "Joined game successfully.",
      game: await serializeGame(game, req.user._id)
    });
  } catch (error) {
    console.error("Join game error:", error);
    return res.status(500).json({ message: "Could not join the game." });
  }
}

export async function getGame(req, res) {
  try {
    const game = await findGame(req.params.roomCode);
    if (!game) return res.status(404).json({ message: "Room not found." });
    if (!isPlayer(game, req.user._id)) {
      return res.status(403).json({ message: "Join this room to view the game." });
    }
    return res.json({ game: await serializeGame(game, req.user._id) });
  } catch (error) {
    console.error("Get game error:", error);
    return res.status(500).json({ message: "Could not load the game." });
  }
}

export async function startGame(req, res) {
  try {
    const game = await findGame(req.params.roomCode);
    if (!game) return res.status(404).json({ message: "Room not found." });
    if (!isHost(game, req.user._id)) return res.status(403).json({ message: "Only the host can start the game." });
    if (game.status !== "waiting") return res.status(409).json({ message: "This game is not waiting to start." });

    // Allow 1 player in Solo mode or for testing; require >= 1 player
    if (game.players.length < 1) return res.status(400).json({ message: "At least one player is required." });

    game.status = "active";
    game.currentQuestionIndex = 0;
    game.startedAt = new Date();
    game.currentQuestionStartedAt = new Date();
    await game.save();
    emitGameUpdate(game.roomCode, { leaderboard: true });

    return res.json({ message: "Game started.", game: await serializeGame(game, req.user._id) });
  } catch (error) {
    console.error("Start game error:", error);
    return res.status(500).json({ message: "Could not start the game." });
  }
}

export async function submitAnswer(req, res) {
  try {
    const game = await findGame(req.params.roomCode);
    if (!game) return res.status(404).json({ message: "Room not found." });
    if (!isPlayer(game, req.user._id)) return res.status(403).json({ message: "You are not a player in this room." });
    if (game.status !== "active" || game.currentQuestionIndex < 0) {
      return res.status(409).json({ message: "There is no active question." });
    }

    const selectedAnswerIndex = Number(req.body.selectedAnswerIndex);
    if (!Number.isInteger(selectedAnswerIndex)) {
      return res.status(400).json({ message: "Select a valid answer." });
    }

    const questionId = game.questionIds[game.currentQuestionIndex];
    const question = await Question.findById(questionId);
    if (!question) return res.status(500).json({ message: "The current question is unavailable." });
    if (selectedAnswerIndex < 0 || selectedAnswerIndex >= question.options.length) {
      return res.status(400).json({ message: "Selected option is invalid." });
    }

    const alreadyAnswered = await GameAnswer.findOne({
      gameId: game._id,
      userId: req.user._id,
      questionId
    });
    if (alreadyAnswered) {
      return res.status(409).json({ message: "You have already answered this question." });
    }

    const responseTimeMs = Math.max(
      0,
      Date.now() - new Date(game.currentQuestionStartedAt).getTime()
    );
    const timeLimitMs = game.questionTimeLimitSeconds * 1000;
    const withinTime = responseTimeMs <= timeLimitMs + 1000; // 1s grace margin for network lag
    const isCorrect = withinTime && selectedAnswerIndex === question.correctAnswerIndex;

    const player = game.players.find((item) => item.userId.toString() === req.user._id.toString());
    const nextStreak = isCorrect ? player.currentStreak + 1 : 0;
    const basePoints = isCorrect
      ? calculateBasePoints(responseTimeMs, game.questionTimeLimitSeconds)
      : 0;
    const bonusPoints = isCorrect ? streakBonus(nextStreak) : 0;
    const totalPoints = basePoints + bonusPoints;

    let answer;
    try {
      answer = await GameAnswer.create({
        gameId: game._id,
        userId: req.user._id,
        questionId,
        selectedAnswerIndex,
        isCorrect,
        responseTimeMs,
        basePoints,
        bonusPoints,
        totalPoints,
        streakAfterAnswer: nextStreak
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "You have already answered this question." });
      }
      throw error;
    }

    player.score += totalPoints;
    player.currentStreak = nextStreak;
    player.longestStreak = Math.max(player.longestStreak, nextStreak);
    if (isCorrect) player.correctAnswers = (player.correctAnswers || 0) + 1;

    await game.save();
    emitGameUpdate(game.roomCode, { leaderboard: true });

    return res.status(201).json({
      message: "Answer submitted.",
      result: {
        isCorrect,
        correctAnswerIndex: question.correctAnswerIndex,
        explanation: question.explanation,
        responseTimeMs,
        basePoints,
        bonusPoints,
        totalPoints,
        currentStreak: nextStreak,
        answerId: answer._id
      },
      game: await serializeGame(game, req.user._id)
    });
  } catch (error) {
    console.error("Submit answer error:", error);
    return res.status(500).json({ message: "Could not submit your answer." });
  }
}

export async function nextQuestion(req, res) {
  try {
    const game = await findGame(req.params.roomCode);
    if (!game) return res.status(404).json({ message: "Room not found." });
    if (!isHost(game, req.user._id)) return res.status(403).json({ message: "Only the host can move to the next question." });
    if (game.status !== "active") return res.status(409).json({ message: "The game is not active." });

    const currentQuestionId = game.questionIds[game.currentQuestionIndex];
    const answeredCount = await GameAnswer.countDocuments({
      gameId: game._id,
      questionId: currentQuestionId
    });
    const timeExpired =
      Date.now() >= new Date(game.currentQuestionStartedAt).getTime() +
      game.questionTimeLimitSeconds * 1000;
    const allPlayersAnswered = answeredCount >= game.players.length;

    if (!timeExpired && !allPlayersAnswered) {
      return res.status(409).json({
        message: "Wait until the timer ends or all players have answered.",
        answeredCount,
        playerCount: game.players.length
      });
    }

    // Unanswered players get 0 and streak resets
    if (timeExpired) {
      const answeredIds = new Set(
        (await GameAnswer.find({ gameId: game._id, questionId: currentQuestionId }).select("userId"))
          .map((item) => item.userId.toString())
      );
      const timeoutAt = new Date();
      for (const player of game.players) {
        if (!answeredIds.has(player.userId.toString())) {
          try {
            await GameAnswer.create({
              gameId: game._id,
              userId: player.userId,
              questionId: currentQuestionId,
              selectedAnswerIndex: -1,
              isCorrect: false,
              responseTimeMs: game.questionTimeLimitSeconds * 1000,
              basePoints: 0,
              bonusPoints: 0,
              totalPoints: 0,
              streakAfterAnswer: 0,
              createdAt: timeoutAt
            });
          } catch (error) {
            if (error.code !== 11000) throw error;
          }
          player.currentStreak = 0;
        }
      }
    }

    const nextIndex = game.currentQuestionIndex + 1;
    if (nextIndex >= game.questionIds.length) {
      game.status = "completed";
      game.finishedAt = new Date();
      game.currentQuestionStartedAt = null;
      await finalizeGameStats(game);
    } else {
      game.currentQuestionIndex = nextIndex;
      game.currentQuestionStartedAt = new Date();
    }

    await game.save();
    emitGameUpdate(game.roomCode, { leaderboard: true });
    return res.json({
      message: game.status === "completed" ? "Game completed." : "Next question started.",
      game: await serializeGame(game, req.user._id)
    });
  } catch (error) {
    console.error("Next question error:", error);
    return res.status(500).json({ message: "Could not move to the next question." });
  }
}

export async function getGameAnswers(req, res) {
  try {
    const game = await findGame(req.params.roomCode);
    if (!game) return res.status(404).json({ message: "Room not found." });
    if (!isPlayer(game, req.user._id)) return res.status(403).json({ message: "You are not a player in this room." });

    const answers = await GameAnswer.find({ gameId: game._id, userId: req.user._id })
      .populate("questionId", "question options category imageUrl questionType explanation correctAnswerIndex")
      .sort({ createdAt: 1 })
      .lean();

    return res.json({
      answers: answers.map((item) => ({
        question: item.questionId?.question || "Question",
        category: item.questionId?.category || "",
        imageUrl: item.questionId?.imageUrl || "",
        questionType: item.questionId?.questionType || "banana",
        selectedAnswerIndex: item.selectedAnswerIndex,
        correctAnswerIndex: item.questionId?.correctAnswerIndex,
        explanation: item.questionId?.explanation || "",
        isCorrect: item.isCorrect,
        responseTimeMs: item.responseTimeMs,
        basePoints: item.basePoints,
        bonusPoints: item.bonusPoints,
        totalPoints: item.totalPoints,
        streakAfterAnswer: item.streakAfterAnswer
      }))
    });
  } catch (error) {
    console.error("Get answers error:", error);
    return res.status(500).json({ message: "Could not load answer summary." });
  }
}
