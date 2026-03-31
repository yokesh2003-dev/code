import { Router } from "express";
import { login } from "../controllers/authController";
import { authLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/login", authLimiter, login);

export default router;
