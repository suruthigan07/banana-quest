import mongoose from "mongoose";

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
    avatar: { type: String, default: "" },
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
    lastLogin: { type: Date, default: null }
  },
  { timestamps: true }
);

userSchema.index(
  { "identities.provider": 1, "identities.providerId": 1 },
  { unique: true, sparse: true }
);

export default mongoose.model("User", userSchema);
