import type { Role } from "./auth";

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  guru: "Guru",
  siswa: "Siswa",
  kurikulum: "Kurikulum",
  kepsek: "Kepala Sekolah",
};

export const ALL_ROLES: Role[] = ["admin", "guru", "siswa", "kurikulum", "kepsek"];

export const ROLE_TONE: Record<Role, string> = {
  admin: "blue",
  guru: "green",
  siswa: "orange",
  kurikulum: "purple",
  kepsek: "teal",
};

/** Awal tahun ajaran aktif, mis. "2026/2027" -> 2026. */
export function tahunAjaranAwal(tahun: string | undefined | null): number {
  const n = parseInt(String(tahun ?? "").slice(0, 4), 10);
  return Number.isFinite(n) ? n : new Date().getFullYear();
}

/**
 * NIP pegawai (admin, guru, kurikulum, kepsek) = 18 digit angka.
 * 8 digit pertama tanggal lahir (YYYYMMDD) + 4 bulan/tahun pengangkatan + nomor urut 4 digit.
 * Format ini meniru NIP PNS sehingga setiap akun punya NIP numerik yang unik.
 */
export function buatNIP(tanggalLahir: string, tahunAngkat: number, bulanAngkat: number, urut: number) {
  const tgl = tanggalLahir.replace(/\D/g, "").padEnd(8, "0").slice(0, 8);
  const yy = String(tahunAngkat % 100).padStart(2, "0");
  const mm = String(bulanAngkat).padStart(2, "0");
  return `${tgl}${yy}${mm}${String(urut).padStart(4, "0")}`;
}

/** NIS siswa = tahun masuk + kode jurusan (3) + nomor urut (3) + kode kelas (1). */
export function buatNIS(tahunMasuk: number, kodeJurusan: string, urut: number, kodeKelas: number) {
  return `${tahunMasuk}${kodeJurusan}${String(urut).padStart(3, "0")}${kodeKelas}`;
}

/** Angka rata-rata satu desimal. */
export function rata2(list: number[]) {
  const v = list.filter(n => Number.isFinite(n));
  if (!v.length) return 0;
  return Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10;
}

/** Huruf mutu dari nilai akhir. */
export function predikat(nilai: number) {
  if (nilai >= 90) return "A";
  if (nilai >= 80) return "B";
  if (nilai >= 70) return "C";
  if (nilai >= 60) return "D";
  return "E";
}

export function toneNilai(nilai: number) {
  return nilai >= 80 ? "green" : nilai >= 70 ? "blue" : nilai >= 60 ? "orange" : "red";
}

/** Format tanggal pendek bahasa Indonesia, aman untuk server & client. */
export function tanggal(d: Date | string | undefined | null) {
  if (!d) return "—";
  const t = new Date(d);
  if (Number.isNaN(t.getTime())) return "—";
  return t.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export function jam(d: Date | string | undefined | null) {
  if (!d) return "";
  const t = new Date(d);
  if (Number.isNaN(t.getTime())) return "";
  return t.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

/** Sisa hari menuju deadline (negatif = terlambat). */
export function sisaHari(deadline: Date | string | undefined | null) {
  if (!deadline) return null;
  const t = new Date(deadline).getTime();
  if (Number.isNaN(t)) return null;
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);
  const target = new Date(t);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - hariIni.getTime()) / 86400000);
}
