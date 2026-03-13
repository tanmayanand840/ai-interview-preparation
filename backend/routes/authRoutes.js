import { Router } from "express";
const router = Router();
import {
  register,
  login,
  googleFirebaseLogin,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.post("/google-firebase", googleFirebaseLogin);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;
