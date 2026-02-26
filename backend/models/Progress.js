import { Schema, model } from "mongoose";

const userProgressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true
  },
  status: {
    type: String,
    enum: ["NotStarted", "Attempted", "Solved"],
    default: "NotStarted"
  }
}, { timestamps: true });

// Prevent duplicate progress entries
userProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export default model("UserProgress", userProgressSchema);