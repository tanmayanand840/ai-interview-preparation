import express from "express";
import protect from "../middleware/authMiddleware.js";
import { teachTopic } from "../controllers/learnController.js";

const router = express.Router();

router.post("/topic", protect, teachTopic);

export default router;