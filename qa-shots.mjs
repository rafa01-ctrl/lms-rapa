// QA: login sebagai setiap role lalu screenshot halaman utama tiap role.
// node <skill>/browser.mjs http://localhost:3000/login --script ./qa-shots.mjs
const ROLES = ['admin', 'guru', 'siswa', 'kurikulum', 'kepsek'];
const PAGES = {
  admin: ['/', '/admin/siswa', '/admin/kelas', '/admin/pelajaran'],
  guru: ['/', '/guru/materi', '/guru/tugas', '/guru/nilai', '/guru/quiz'],
  siswa: ['/', '/siswa/materi', '/siswa/tugas', '/siswa/quiz', '/siswa/nilai'],
  kurikulum: ['/', '/kurikulum/nilai', '/kurikulum/pelajaran'],
  kepsek: ['/', '/kepsek/laporan', '/kepsek/nilai'],
};

export default async function run(page, ui) {
  const base = new URL(page.url()).origin;
  const out = [];
  for (const role of ROLES) {
    await page.goto(`${base}/login`);
    await page.waitForTimeout(500);
    const snap = await ui.snapshot();
    const lines = snap.split('\n').filter(l => l.includes('email') || l.includes('button'));
    const line = lines.find(l => l.includes(`@citra.sch.id`));
    const label = role === 'admin' ? 'Administrator' : role === 'kepsek' ? 'Kepala Sekolah' : role[0].toUpperCase() + role.slice(1);
    const hit = lines.find(l => l.includes(`"${label} `)) || line;
    const ref = hit?.match(/@(e\d+)/)?.[1];
    if (!ref) { out.push({ role, error: 'role card not found', snap: snap.slice(0, 600) }); continue; }
    await ui.click(ref);
    await page.waitForTimeout(400);
    const snap2 = await ui.snapshot();
    const masuk = snap2.match(/(@e\d+) button "Masuk"/)?.[1];
    if (masuk) await ui.click(masuk);
    await page.waitForTimeout(2500);
    for (const p of PAGES[role]) {
      await page.goto(`${base}${p}`);
      await page.waitForTimeout(1500);
      const file = `qa-${role}${p === '/' ? '' : p.replace(/\//g, '-')}.png`;
      await page.screenshot({ path: file, fullPage: true });
      const info = await page.evaluate(() => ({
        url: location.pathname,
        chars: document.body.innerText.length,
        txt: document.body.innerText.slice(0, 220).replace(/\s+/g, ' '),
      }));
      out.push({ role, file, ...info });
    }
  }
  return out;
}
