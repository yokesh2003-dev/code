import { Response } from "express";
import axios from "axios";
import { Meeting } from "../models/Meeting";
import { Task } from "../models/Task";
import { AuthRequest } from "../middleware/auth";
import { logger } from "../../lib/logger";

interface GeminiTask {
  title: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

async function callGemini(text: string): Promise<GeminiTask[]> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const prompt = `Extract tasks from the following meeting notes. Return ONLY a valid JSON array with objects containing: title (string), priority ("low"|"medium"|"high"), dueDate (ISO date string or null). No extra text, just the JSON array.

Meeting notes:
${text}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
  });

  const raw: string =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned) as GeminiTask[];
  } catch {
    logger.warn({ raw }, "Failed to parse Gemini response as JSON");
    return [];
  }
}

function simulateTranscription(filePath: string): string {
  return `[Transcribed audio from file: ${filePath}] Sample meeting content: Discuss project timeline, assign tasks to team members, review Q2 goals, schedule follow-up meeting for next week.`;
}

export async function uploadAudio(req: AuthRequest, res: Response): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "Audio file is required" });
      return;
    }

    const transcribed = simulateTranscription(file.path);

    const meeting = await Meeting.create({
      type: "audio",
      content: transcribed,
      createdBy: req.user!._id,
    });

    const extractedTasks = await callGemini(transcribed);

    const saved = await Task.insertMany(
      extractedTasks.map((t) => ({
        title: t.title,
        priority: t.priority ?? "medium",
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        createdBy: req.user!._id,
      }))
    );

    res.status(201).json({
      meeting: { id: meeting._id, type: meeting.type },
      tasks: saved,
    });
  } catch (err) {
    res.status(500).json({ error: "Audio processing failed", details: String(err) });
  }
}

export async function processText(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { content } = req.body as { content: string };

    if (!content || content.trim().length === 0) {
      res.status(400).json({ error: "Content (meeting notes text) is required" });
      return;
    }

    const meeting = await Meeting.create({
      type: "text",
      content,
      createdBy: req.user!._id,
    });

    const extractedTasks = await callGemini(content);

    const saved = await Task.insertMany(
      extractedTasks.map((t) => ({
        title: t.title,
        priority: t.priority ?? "medium",
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        createdBy: req.user!._id,
      }))
    );

    res.status(201).json({
      meeting: { id: meeting._id, type: meeting.type },
      tasks: saved,
    });
  } catch (err) {
    res.status(500).json({ error: "Text processing failed", details: String(err) });
  }
}
