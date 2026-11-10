import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createGame,
  joinGame,
  getGame,
  startGame,
  submitAnswer,
  nextQuestion,
  getGameAnswers,
  getRandomPuzzle
} from "../controllers/gameController.js";

const router = Router();

// Public Banana API puzzle endpoint
router.get("/puzzle/random", getRandomPuzzle);

router.use(requireAuth);
router.post("/", createGame);
router.post("/:roomCode/join", joinGame);
router.get("/:roomCode", getGame);
router.post("/:roomCode/start", startGame);
router.post("/:roomCode/answer", submitAnswer);
router.post("/:roomCode/next", nextQuestion);
router.get("/:roomCode/answers", getGameAnswers);

export default router;
