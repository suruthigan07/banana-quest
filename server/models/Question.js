import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (items) => items.length >= 2 && items.length <= 6,
        message: "A question must have between 2 and 6 options."
      }
    },
    correctAnswerIndex: { type: Number, required: true, min: 0 },
    explanation: { type: String, default: "" },
    category: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy"
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

questionSchema.pre("validate", function () {
  if (this.correctAnswerIndex >= this.options.length) {
    this.invalidate("correctAnswerIndex", "Correct answer index must match an option.");
  }
});

export default mongoose.model("Question", questionSchema);
