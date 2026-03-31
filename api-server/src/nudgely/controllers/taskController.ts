import { Response } from "express";
import { Task } from "../models/Task";
import { AuthRequest } from "../middleware/auth";

export async function getTasks(req: AuthRequest, res: Response): Promise<void> {
  try {
    const tasks = await Task.find({ createdBy: req.user!._id })
      .populate("assignedTo", "username role")
      .lean();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks", details: String(err) });
  }
}

export async function updateTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const updates = req.body as Record<string, unknown>;

    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user!._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({ error: "Task not found or unauthorized" });
      return;
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task", details: String(err) });
  }
}

export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const deleted = await Task.findOneAndDelete({ _id: id, createdBy: req.user!._id });

    if (!deleted) {
      res.status(404).json({ error: "Task not found or unauthorized" });
      return;
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task", details: String(err) });
  }
}
