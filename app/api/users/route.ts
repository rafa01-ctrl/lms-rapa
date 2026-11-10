import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, requireRole } from '@/lib/auth';
import { fail, ok, handler } from '@/lib/api';

const ROLES = ['admin', 'guru', 'siswa', 'kurikulum', 'kepsek'];

/**
 * GET /api/users?role=siswa&classId=...
 * admin: semua user · guru/kurikulum/kepsek: semua user (tanpa password)
 * · siswa: hanya profilnya sendiri (dipakai halaman profil / pengumuman).
 */
export async function GET(req: Request) {
  return handler(async () => {
    const s = await requireRole(['admin', 'guru', 'kurikulum', 'kepsek', 'siswa']);
    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const classId = searchParams.get('classId');
    const q: any = {};
    if (s.role === 'siswa') q._id = s.id;
    if (role && ROLES.includes(role)) q.role = role;
    if (classId) q.classId = classId;
    const users = await User.find(q).select('-password').populate('classId', 'name level major').sort({ name: 1 }).lean();
    return ok(users);
  }, 'Gagal mengambil data pengguna');
}

export async function POST(req: Request) {
  return handler(async () => {
    const me = await requireRole(['admin']);
    const b = await req.json();
    if (!b.name || !b.email || !b.password || !b.role) return fail('Nama, email, password, dan role wajib diisi');
    if (!ROLES.includes(b.role)) return fail('Role tidak dikenali');
    if (String(b.password).length < 6) return fail('Password minimal 6 karakter');
    // NIP pegawai & NIS siswa wajib berisi angka saja (boleh kosong untuk admin).
    if (b.nip && !/^\d+$/.test(String(b.nip))) return fail('NIP harus berupa angka');
    if (b.nis && !/^\d+$/.test(String(b.nis))) return fail('NIS harus berupa angka');
    if (b.role === 'siswa' && !b.classId) return fail('Siswa wajib dipilihkan kelas');
    await connectDB();
    const exists = await User.findOne({ email: String(b.email).toLowerCase() });
    if (exists) return fail('Email sudah terdaftar', 409);
    if (b.nip) { const ada = await User.findOne({ nip: String(b.nip) }); if (ada) return fail('NIP sudah dipakai pengguna lain', 409); }
    if (b.nis) { const ada = await User.findOne({ nis: String(b.nis) }); if (ada) return fail('NIS sudah dipakai siswa lain', 409); }
    const payload: any = { name: b.name, email: String(b.email).toLowerCase(), password: await hashPassword(b.password), role: b.role };
    for (const k of ['classId', 'nis', 'nip', 'phone']) if (b[k]) payload[k] = b[k];
    const user = await User.create(payload);
    return ok({ id: user._id }, 201);
  }, 'Gagal membuat user');
}
