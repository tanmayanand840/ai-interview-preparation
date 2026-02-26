import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  startAdaptiveInterview,
  submitAdaptiveAnswer
} from "../controllers/adaptiveController.js";

const router = express.Router();

router.post("/start", protect, startAdaptiveInterview);
router.post("/answer", protect, submitAdaptiveAnswer);

export default router;