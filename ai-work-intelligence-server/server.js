require("dotenv").config();
console.log("👉 Trying to connect to MongoDB...");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 MongoDB CONNECTED SUCCESS");
  })
  .catch((err) => {
    console.error("❌ MongoDB ERROR:");
    console.error(err);
  });

// ===== USER MODEL =====
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["SUPER_ADMIN", "USER"], default: "USER" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("Nudgely Backend Running");
});

// ===== SETUP ADMIN (ONE TIME) =====
app.get("/setup-admin", async (req, res) => {
  try {
    const existing = await User.findOne({ username: "admin" });
    if (existing) return res.send("Admin already exists");

    const hashed = await bcrypt.hash("admin123", 10);

    const user = new User({
      username: "admin",
      password: hashed,
      role: "SUPER_ADMIN",
    });

    await user.save();
    res.send("Admin created");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating admin");
  }
});

// ===== LOGIN ROUTE =====
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({
      message: "Login successful",
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
