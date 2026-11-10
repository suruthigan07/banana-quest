import { Router } from "express";
import rateLimit from "express-rate-limit";
import passport, { facebookConfigured, googleConfigured } from "../config/passport.js";
import {
  register, login, logout, me, socialLogin, updateProfile, getGlobalLeaderboard
} from "../controllers/authController.js";
import { requireAuth, optionalAuth } from "../middleware/authMiddleware.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." }
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);
router.put("/profile", requireAuth, updateProfile);
router.get("/leaderboard", optionalAuth, getGlobalLeaderboard);

router.get(
  "/google",
  (req, res, next) => {
    if (!googleConfigured) {
      return res.status(503).json({ message: "Google login is not configured yet." });
    }
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`
  }),
  socialLogin
);

router.get(
  "/facebook",
  (req, res, next) => {
    if (!facebookConfigured) {
      return res.status(503).json({ message: "Facebook login is not configured yet." });
    }
    next();
  },
  passport.authenticate("facebook", { scope: ["email"], session: false })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=facebook_failed`
  }),
  socialLogin
);

export default router;
