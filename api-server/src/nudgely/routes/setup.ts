import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

const router = Router();

router.post("/setup", async (_req: Request, res: Response): Promise<void> => {
  try {
    const existing = await User.findOne({ role: "SUPER_ADMIN" });
    if (existing) {
      res.status(409).json({ error: "Super Admin already exists. Setup is disabled." });
      return;
    }

    const hashed = await bcrypt.hash("Admin@123", 12);
    const admin = await User.create({
      username: "admin",
      password: hashed,
      role: "SUPER_ADMIN",
    });

    res.status(201).json({
      message: "Super Admin created successfully. Use these credentials to login.",
      username: admin.username,
      password: "Admin@123",
      role: admin.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Setup failed", details: String(err) });
  }
});

export default router;
