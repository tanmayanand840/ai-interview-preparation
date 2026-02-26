import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  topic: String,
  question: String,
  answer: String,
  score: Number,
  feedback: String
}, { timestamps: true });

export default mongoose.model("Attempt", attemptSchema);