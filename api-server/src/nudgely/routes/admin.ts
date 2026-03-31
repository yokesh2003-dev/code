import { Router } from "express";
import { createUser, listUsers, deleteUser } from "../controllers/adminController";
import { authenticate, requireSuperAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate, requireSuperAdmin);

router.post("/create-user", createUser);
router.get("/users", listUsers);
router.delete("/user/:id", deleteUser);

export default router;
