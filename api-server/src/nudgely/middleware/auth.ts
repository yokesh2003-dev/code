import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    res.status(500).json({ error: "Server misconfigured: JWT_SECRET missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string };
    User.findById(decoded.id)
      .then((user) => {
        if (!user) {
          res.status(401).json({ error: "User not found" });
          return;
        }
        req.user = user;
        next();
      })
      .catch(() => {
        res.status(500).json({ error: "Authentication error" });
      });
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.user?.role !== "SUPER_ADMIN") {
    res.status(403).json({ error: "Super admin access required" });
    return;
  }
  next();
}
