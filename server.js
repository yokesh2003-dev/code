const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * TEST API
 * Check if frontend can connect
 */
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected ✅" });
});

/**
 * TASK GENERATION API (dummy for now)
 */
app.post("/api/tasks/generate", (req, res) => {
  const { input } = req.body;

  res.json({
    tasks: [`Understand: ${input}`, "Break into steps", "Execute tasks"],
  });
});

/**
 * SERVER START
 */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
