import mongoose, { Schema, models, model } from "mongoose";
/**
 * Pengumuman sekolah. targetRoles = role penerima (kosong = semua role).
 * category: info | tugas | akademik | kegiatan | penting  (dipakai untuk label warna di UI)
 */
const AnnouncementSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ["info", "tugas", "akademik", "kegiatan", "penting"], default: "info" },
  authorId: { type: Schema.Types.ObjectId, ref: "User" },
  targetRoles: [String],
  classIds: [{ type: Schema.Types.ObjectId, ref: "Class" }]
}, { timestamps: true });
export default models.Announcement || model("Announcement", AnnouncementSchema);
