import { Schema, model } from "mongoose";

const problemSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true
  },
  link: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default model("Problem", problemSchema);