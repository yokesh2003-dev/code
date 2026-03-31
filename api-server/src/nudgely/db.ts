import mongoose from "mongoose";
import { logger } from "../lib/logger";

let isConnected = false;

export async function connectMongoDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env["MONGO_URI"];
  if (!uri) {
    logger.warn("MONGO_URI not set — MongoDB features (Nudgely) will be unavailable");
    return;
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    logger.info("MongoDB connected (Nudgely)");
  } catch (err) {
    logger.error({ err }, "MongoDB connection failed");
  }
}
