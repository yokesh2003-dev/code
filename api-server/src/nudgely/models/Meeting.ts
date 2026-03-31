import mongoose, { Document, Schema, Types } from "mongoose";

export type MeetingType = "audio" | "text";

export interface IMeeting extends Document {
  type: MeetingType;
  content: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    type: { type: String, enum: ["audio", "text"], required: true },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export const Meeting = mongoose.model<IMeeting>("Meeting", MeetingSchema);
