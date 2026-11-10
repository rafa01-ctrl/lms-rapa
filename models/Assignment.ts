import mongoose, { Schema, models, model } from "mongoose";
/**
 * Tugas / proyek dari guru. type: tugas | proyek. progress: draf | berjalan | selesai.
 */
const AssignmentSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["tugas", "proyek"], default: "tugas" },
  progress: { type: String, enum: ["draf", "berjalan", "selesai"], default: "berjalan" },
  dueDate: Date,
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
  classIds: [{ type: Schema.Types.ObjectId, ref: "Class" }],
  attachmentUrl: String
}, { timestamps: true });
export default models.Assignment || model("Assignment", AssignmentSchema);
