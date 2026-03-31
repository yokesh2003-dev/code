import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "SUPER_ADMIN" | "USER";

export interface IUser extends Document {
  username: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["SUPER_ADMIN", "USER"], default: "USER" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export const User = mongoose.model<IUser>("User", UserSchema);
