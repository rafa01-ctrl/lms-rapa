import mongoose, { Schema, models, model } from "mongoose";
/**
 * Pengumpulan tugas oleh siswa. status: dikumpulkan | terlambat | dinilai.
 * feedback boleh diisi guru kapan saja (walau belum dinilai).
 */
const SubmissionSchema = new Schema({
  assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: String,
  answerText: String,
  score: Number,
  feedback: String,
  status: { type: String, enum: ["dikumpulkan", "terlambat", "dinilai"], default: "dikumpulkan" },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });
SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
export default models.Submission || model("Submission", SubmissionSchema);
