import express from "express";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";
import {
  generateQuestion,
  evaluateAnswer,
  getHistory,
  analyzeResumeJD,
  analyzeResumeJDFromUpload,
} from "../controllers/interviewController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/generate", protect, generateQuestion);
router.post("/evaluate", protect, evaluateAnswer);
router.get("/history", protect, getHistory);
router.post("/resume-match", protect, analyzeResumeJD);
router.post(
  "/resume-match-upload",
  protect,
  upload.fields([
    { name: "resumePdf", maxCount: 1 },
    { name: "jdPdf", maxCount: 1 },
  ]),
  analyzeResumeJDFromUpload,
);

export default router;
