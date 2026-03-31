import { Router } from "express";
import multer from "multer";
import path from "path";
import { authenticate } from "../middleware/auth";
import { uploadAudio, processText } from "../controllers/meetingController";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve("src/nudgely/uploads"));
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/webm"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});

const router = Router();

router.use(authenticate);

router.post("/upload-audio", upload.single("audio"), uploadAudio);
router.post("/process-text", processText);

export default router;
