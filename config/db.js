const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to Mongo...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ DB Error:", error.message);

    // ❌ REMOVE THIS LINE:
    // process.exit(1);

    // ✅ Replace with this:
    console.log("⚠️ Server will continue without DB");
  }
};

module.exports = connectDB;
