import mongoose from "mongoose";

const authLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    email: { type: String, lowercase: true, trim: true, default: "" },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      required: true
    },
    action: {
      type: String,
      enum: ["register", "login", "logout", "oauth_login"],
      required: true
    },
    success: { type: Boolean, required: true },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    reason: { type: String, default: "" }
  },
  { timestamps: true }
);

authLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });

export default mongoose.model("AuthLog", authLogSchema);
