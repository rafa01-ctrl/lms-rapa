/**
 * Seed data demo LMS SMK Citra Negara.
 * - Siswa: Rafa Arsyavin (X PPLG 2)
 * - Mengisi materi, tugas, quiz, nilai, pengumuman, dan submission
 *   supaya dashboard siswa & guru tidak kosong.
 *
 * Jalankan: npm run seed
 */
import 'dotenv/config';
import { connectDB } from '../lib/db';
import User from '../models/User';
import Class from '../models/Class';
import Subject from '../models/Subject';
import Material from '../models/Material';
import Assignment from '../models/Assignment';
import Quiz from '../models/Quiz';
import Grade from '../models/Grade';
import Announcement from '../models/Announcement';
import Submission from '../models/Submission';
import QuizAttempt from '../models/QuizAttempt';
import { hashPassword } from '../lib/auth';

const hari = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(23, 59, 0, 0);
  return d;
};

async function main() {
  await connectDB();

  // Reset seluruh data demo supaya seed bisa dijalankan berulang
  await Promise.all([
    User.deleteMany({}),
    Class.deleteMany({}),
    Subject.deleteMany({}),
    Material.deleteMany({}),
    Assignment.deleteMany({}),
    Quiz.deleteMany({}),
    Grade.deleteMany({}),
    Announcement.deleteMany({}),
    Submission.deleteMany({}),
    QuizAttempt.deleteMany({}),
  ]);

  // --- Akun dasar ---
  const [admin, guru, kurikulum, kepsek] = await User.create([
    { name: 'Administrator', email: 'admin@citra.sch.id', password: await hashPassword('admin123'), role: 'admin' },
    { name: 'Irmanyah Putra', email: 'guru@citra.sch.id', password: await hashPassword('guru123'), role: 'guru', nip: '19880101202601' },
    { name: 'Tim Kurikulum', email: 'kurikulum@citra.sch.id', password: await hashPassword('kurikulum123'), role: 'kurikulum' },
    { name: 'Kepala Sekolah', email: 'kepsek@citra.sch.id', password: await hashPassword('kepsek123'), role: 'kepsek' },
  ]);

  // --- Kelas & mata pelajaran ---
  const kelas = await Class.create({
    name: 'X PPLG 2',
    level: '10',
    major: 'PPLG',
    academicYear: '2026/2027',
    homeroomTeacherId: guru._id,
  });

  const [pweb, bd, mtk] = await Subject.create([
    { name: 'Pemrograman Web', code: 'PWEB', teacherIds: [guru._id], classIds: [kelas._id] },
    { name: 'Basis Data', code: 'BD', teacherIds: [guru._id], classIds: [kelas._id] },
    { name: 'Matematika', code: 'MTK', teacherIds: [guru._id], classIds: [kelas._id] },
  ]);

  // --- Siswa ---
  const siswa = await User.create({
    name: 'Rafa Arsyavin',
    email: 'siswa@citra.sch.id',
    password: await hashPassword('siswa123'),
    role: 'siswa',
    nis: '102026001',
    classId: kelas._id,
  });

  // --- Materi (terlihat oleh siswa karena classIds berisi kelasnya) ---
  await Material.create([
    {
      title: 'HTML Dasar: Struktur Halaman Web',
      description: 'Pengenalan tag HTML, elemen head dan body, serta membuat halaman web pertama.',
      link: 'https://developer.mozilla.org/id/docs/Web/HTML',
      teacherId: guru._id,
      subjectId: pweb._id,
      classIds: [kelas._id],
    },
    {
      title: 'CSS Dasar: Layout dengan Flexbox',
      description: 'Mengatur tata letak halaman memakai display flex, justify-content, dan align-items.',
      link: 'https://developer.mozilla.org/id/docs/Web/CSS/CSS_flexible_box_layout',
      teacherId: guru._id,
      subjectId: pweb._id,
      classIds: [kelas._id],
    },
    {
      title: 'JavaScript Dasar: Variabel & Fungsi',
      description: 'Mengenal let/const, tipe data primitif, dan membuat function untuk logika sederhana.',
      link: 'https://developer.mozilla.org/id/docs/Web/JavaScript/Guide',
      teacherId: guru._id,
      subjectId: pweb._id,
      classIds: [kelas._id],
    },
    {
      title: 'Pengenalan Basis Data Relasional',
      description: 'Konsep tabel, primary key, foreign key, serta contoh relasi antar tabel.',
      link: 'https://www.w3schools.com/sql/sql_intro.asp',
      teacherId: guru._id,
      subjectId: bd._id,
      classIds: [kelas._id],
    },
    {
      title: 'SELECT, WHERE, dan ORDER BY',
      description: 'Menampilkan data dengan kondisi dan mengurutkan hasil query.',
      link: 'https://www.w3schools.com/sql/sql_where.asp',
      teacherId: guru._id,
      subjectId: bd._id,
      classIds: [kelas._id],
    },
    {
      title: 'Operasi Matriks',
      description: 'Penjumlahan, perkalian, dan transpose matriks beserta contoh soal.',
      link: 'https://www.khanacademy.org/math/precalculus',
      teacherId: guru._id,
      subjectId: mtk._id,
      classIds: [kelas._id],
    },
  ]);

  // --- Tugas & proyek ---
  const [tugasHtml, tugasSql, tugasMatriks] = await Assignment.create([
    {
      title: 'Tugas 1: Membuat Halaman Profil HTML',
      description: 'Buat halaman profil sederhana memakai HTML lengkap dengan foto, biodata, dan tautan.',
      dueDate: hari(5),
      teacherId: guru._id,
      subjectId: pweb._id,
      classIds: [kelas._id],
      attachmentUrl: 'https://classroom.google.com',
    },
    {
      title: 'Proyek 1: Website Portofolio',
      description: 'Bangun website portofolio 1 halaman memakai HTML + CSS Flexbox. Kumpulkan dalam bentuk link.',
      dueDate: hari(12),
      teacherId: guru._id,
      subjectId: pweb._id,
      classIds: [kelas._id],
    },
    {
      title: 'Tugas 2: Query SELECT & WHERE',
      description: 'Kerjakan 10 soal query pada database sekolah yang sudah disediakan guru.',
      dueDate: hari(3),
      teacherId: guru._id,
      subjectId: bd._id,
      classIds: [kelas._id],
    },
    {
      title: 'Latihan: Operasi Matriks',
      description: 'Selesaikan 15 soal penjumlahan dan perkalian matriks pada buku latihan.',
      dueDate: hari(7),
      teacherId: guru._id,
      subjectId: mtk._id,
      classIds: [kelas._id],
    },
  ]);

  // --- Quiz & ujian ---
  await Quiz.create([
    {
      title: 'Quiz 1: Dasar HTML',
      description: '10 soal pilihan ganda seputar tag dan struktur HTML.',
      type: 'quiz',
      teacherId: guru._id,
      subjectId: pweb._id,
      classIds: [kelas._id],
      duration: 20,
      published: true,
      questions: [
        { question: 'Tag HTML untuk membuat judul terbesar adalah?', options: ['<h1>', '<head>', '<big>', '<title>'], answer: 0, points: 10 },
        { question: 'Atribut untuk menyisipkan alamat gambar adalah?', options: ['href', 'src', 'link', 'url'], answer: 1, points: 10 },
        { question: 'Tag untuk membuat tautan adalah?', options: ['<link>', '<a>', '<url>', '<ref>'], answer: 1, points: 10 },
      ],
    },
    {
      title: 'Quiz 2: Dasar CSS',
      description: 'Soal seputar selector dan properti CSS umum.',
      type: 'quiz',
      teacherId: guru._id,
      subjectId: pweb._id,
      classIds: [kelas._id],
      duration: 20,
      published: true,
      questions: [
        { question: 'Properti untuk mengubah warna teks adalah?', options: ['color', 'background-color', 'font-style', 'text-align'], answer: 0, points: 10 },
        { question: 'Selector id pada CSS diawali dengan?', options: ['.', '#', '@', '*'], answer: 1, points: 10 },
      ],
    },
    {
      title: 'Ujian Tengah Semester: Basis Data',
      description: 'Ujian tertulis daring materi tabel, relasi, dan query dasar.',
      type: 'ujian',
      teacherId: guru._id,
      subjectId: bd._id,
      classIds: [kelas._id],
      duration: 60,
      published: true,
      questions: [
        { question: 'Perintah untuk menampilkan seluruh data pada tabel adalah?', options: ['SELECT * FROM tabel', 'SHOW tabel', 'GET tabel', 'OPEN tabel'], answer: 0, points: 20 },
        { question: 'Primary key berfungsi untuk?', options: ['Menghapus baris', 'Menjamin nilai unik tiap baris', 'Mengurutkan data', 'Menyimpan gambar'], answer: 1, points: 20 },
      ],
    },
  ]);

  // --- Nilai siswa ---
  const nilai = (assignment: number, quiz: number, exam: number) => ({
    assignment,
    quiz,
    exam,
    final: Math.round(assignment * 0.3 + quiz * 0.3 + exam * 0.4),
  });
  await Grade.create([
    { studentId: siswa._id, subjectId: pweb._id, classId: kelas._id, teacherId: guru._id, ...nilai(88, 90, 85) },
    { studentId: siswa._id, subjectId: bd._id, classId: kelas._id, teacherId: guru._id, ...nilai(80, 85, 78) },
    { studentId: siswa._id, subjectId: mtk._id, classId: kelas._id, teacherId: guru._id, ...nilai(75, 82, 80) },
  ]);

  // --- Pengumuman ---
  await Announcement.create([
    {
      title: 'Jadwal Ujian Tengah Semester',
      content: 'UTS dimulai Senin pekan depan. Pastikan semua tugas sudah dikumpulkan sebelum Jumat.',
      authorId: guru._id,
      targetRoles: ['siswa', 'guru', 'kurikulum', 'kepsek'],
      classIds: [kelas._id],
    },
    {
      title: 'Pengumpulan Proyek Website Portofolio',
      content: 'Proyek dikumpulkan dalam bentuk link website, bukan file. Pastikan website dapat diakses publik.',
      authorId: guru._id,
      targetRoles: ['siswa'],
      classIds: [kelas._id],
    },
    {
      title: 'Pemeliharaan Server Laboratorium',
      content: 'Lab komputer akan ditutup Sabtu pukul 08.00–12.00 untuk pemeliharaan rutin.',
      authorId: admin._id,
      targetRoles: ['siswa', 'guru'],
    },
  ]);

  // --- Pengumpulan tugas & percobaan quiz (supaya dashboard guru juga berisi) ---
  await Submission.create([
    {
      assignmentId: tugasHtml._id,
      studentId: siswa._id,
      answerText: 'Halaman profil HTML sudah saya buat dan unggah ke Google Classroom.',
      fileUrl: 'https://classroom.google.com',
      score: 88,
      feedback: 'Struktur HTML rapi. Tambahkan atribut alt pada gambar.',
      submittedAt: hari(-2),
    },
    {
      assignmentId: tugasSql._id,
      studentId: siswa._id,
      answerText: 'Query SELECT dan WHERE sudah dikerjakan di lab, lampiran berupa screenshot.',
      fileUrl: 'https://drive.google.com',
      score: 80,
      feedback: 'Query benar, perhatikan penggunaan alias.',
      submittedAt: hari(-1),
    },
  ]);

  await QuizAttempt.create([
    { quizId: (await Quiz.findOne({ title: 'Quiz 1: Dasar HTML' }))!._id, studentId: siswa._id, answers: [0, 1, 1], score: 100, submittedAt: hari(-3) },
  ]);

  console.log('Seed selesai.');
  console.log('Akun: admin/guru/siswa/kurikulum/kepsek sesuai README.');
  console.log('Siswa demo: Rafa Arsyavin (siswa@citra.sch.id / siswa123)');
  console.log(`Data terisi: ${await Material.countDocuments()} materi, ${await Assignment.countDocuments()} tugas, ${await Quiz.countDocuments()} quiz, ${await Grade.countDocuments()} nilai.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
