import mongoose from "mongoose";

/**
 * THEME: VIRTUAL IDENTITY
 * User Model representing the authenticated player's virtual identity.
 * Tracks multiple identity providers (Local JWT, Google OAuth, Facebook OAuth),
 * customizable avatar representation, in-game badges, high scores, and persistent game stats.
 */
const identitySchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      required: true
    },
    providerId: { type: String, required: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 24
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      select: false,
      default: null
    },
    avatar: { type: String, default: "banana-warrior" },
    title: { type: String, default: "Banana Novice" },
    bananaCoins: { type: Number, default: 100 },
    highestStreak: { type: Number, default: 0 },
    badges: {
      type: [String],
      default: ["Banana Rookie", "First Steps"]
    },
    identities: {
      type: [identitySchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "At least one login identity is required."
      }
    },
    role: { type: String, enum: ["player", "admin"], default: "player" },
    totalPoints: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    lastLogin: { type: Date, default: null }
  },
  { timestamps: true }
);

userSchema.index(
  { "identities.provider": 1, "identities.providerId": 1 },
  { unique: true, sparse: true }
);

export default mongoose.model("User", userSchema);
