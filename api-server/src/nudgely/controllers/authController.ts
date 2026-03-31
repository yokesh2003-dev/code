import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body as { username: string; password: string };

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const secret = process.env["JWT_SECRET"];
    if (!secret) {
      res.status(500).json({ error: "Server misconfigured: JWT_SECRET missing" });
      return;
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: String(err) });
  }
}
