import mongoose from "mongoose";

/**
 * Question Model
 * Supports both traditional text multiple-choice and Marc Conrad Banana API visual puzzles.
 */
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length >= 2 && items.length <= 10,
        message: "A question must have between 2 and 10 options."
      }
    },
    correctAnswerIndex: { type: Number, required: true, min: 0 },
    explanation: { type: String, default: "" },
    category: { type: String, required: true, trim: true, default: "Banana API" },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Arcade"],
      default: "Arcade"
    },
    questionType: {
      type: String,
      enum: ["banana", "trivia"],
      default: "banana"
    },
    imageUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

questionSchema.pre("validate", function () {
  if (this.options && this.correctAnswerIndex >= this.options.length) {
    this.invalidate("correctAnswerIndex", "Correct answer index must match an available option.");
  }
});

export default mongoose.model("Question", questionSchema);
