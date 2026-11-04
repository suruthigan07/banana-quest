import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createGame,
  joinGame,
  getGame,
  startGame,
  submitAnswer,
  nextQuestion,
  getGameAnswers
} from "../controllers/gameController.js";

const router = Router();

router.use(requireAuth);

router.post("/", createGame);
router.post("/:roomCode/join", joinGame);
router.get("/:roomCode", getGame);
router.post("/:roomCode/start", startGame);
router.post("/:roomCode/answer", submitAnswer);
router.post("/:roomCode/next", nextQuestion);
router.get("/:roomCode/answers", getGameAnswers);

export default router;
