import { Router } from "express";
import { getTasks, updateTask, deleteTask } from "../controllers/taskController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
