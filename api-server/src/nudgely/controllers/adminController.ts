import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, UserRole } from "../models/User";

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, role } = req.body as {
      username: string;
      password: string;
      role?: UserRole;
    };

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const existing = await User.findOne({ username });
    if (existing) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      password: hashed,
      role: role ?? "USER",
    });

    res.status(201).json({
      id: user._id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user", details: String(err) });
  }
}

export async function listUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await User.find({}, "-password").lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to list users", details: String(err) });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user", details: String(err) });
  }
}
