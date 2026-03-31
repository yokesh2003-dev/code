import { Router } from "express";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import meetingRouter from "./routes/meeting";
import tasksRouter from "./routes/tasks";
import setupRouter from "./routes/setup";
import { globalLimiter } from "./middleware/rateLimit";

const nudgelyRouter = Router();

nudgelyRouter.use(globalLimiter);

nudgelyRouter.use("/auth", authRouter);
nudgelyRouter.use("/admin", adminRouter);
nudgelyRouter.use("/meeting", meetingRouter);
nudgelyRouter.use("/tasks", tasksRouter);
nudgelyRouter.use("/", setupRouter);

nudgelyRouter.get("/", (_req, res) => {
  res.json({
    name: "Nudgely API",
    version: "1.0.0",
    routes: [
      "POST /setup              — Create first Super Admin (one-time only)",
      "POST /auth/login         — Login and get JWT token",
      "POST /admin/create-user  — Create a user (Super Admin only)",
      "GET  /admin/users        — List all users",
      "DELETE /admin/user/:id   — Delete a user",
      "POST /meeting/upload-audio — Upload audio, AI extracts tasks",
      "POST /meeting/process-text — Submit notes, AI extracts tasks",
      "GET  /tasks              — Get your tasks",
      "PUT  /tasks/:id          — Update a task",
      "DELETE /tasks/:id        — Delete a task",
    ],
  });
});

export default nudgelyRouter;
