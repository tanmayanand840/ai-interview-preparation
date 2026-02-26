import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  topic: String,
  difficulty: String,
  currentQuestion: String,
  questionCount: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },

  // 🔥 Store full adaptive history
  questions: [
    {
      question: String,
      answer: String,
      score: Number,
      feedback: String
    }
  ]

}, { timestamps: true });

export default mongoose.model("InterviewSession", interviewSessionSchema);