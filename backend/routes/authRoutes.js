import { Router } from "express";
const router = Router();
import { register, login } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;