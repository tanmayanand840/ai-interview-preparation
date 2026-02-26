import express from "express";
import {
  addProblem,
  getProblemsByTopic,
  updateUserProgress,
  getProgressSummary,
  generateAICodingProblem,
  evaluateAICodingSolution,
} from "../controllers/practiceController.js";
import protect from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// Admin
router.post("/problems", protect, isAdmin, addProblem);

// User
router.get("/problems", protect, getProblemsByTopic);
router.post("/update-status", protect, updateUserProgress);
router.get("/progress-summary", protect, getProgressSummary);

// AI Coding Practice
router.post("/ai/generate-coding", protect, generateAICodingProblem);
router.post("/ai/evaluate-coding", protect, evaluateAICodingSolution);

export default router;
