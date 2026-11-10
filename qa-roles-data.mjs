const BASE = 'http://localhost:3000';

async function login(page, email, password) {
  await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
  await page.getByText(email).first().waitFor({ timeout: 30000 });
  await page.locator('button', { hasText: email }).first().click();
  await page.locator('input[type="password"]').first().waitFor({ timeout: 15000 });
  await page.getByRole('button', { name: 'Masuk' }).click();
  await page.waitForURL(BASE + '/', { timeout: 30000 }).catch(() => { });
  await page.locator('h1').first().waitFor({ timeout: 30000 }).catch(() => { });
}

export default async function run(page) {
  const out = {};

  // ---------- SISWA ----------
  await login(page, 'siswa@citra.sch.id', 'siswa123');
  out.siswa = { dashboard: await page.locator('h1').first().innerText() };
  out.siswa.stats = await page.locator('.card .stat').allInnerTexts();

  const pages = { materi: '/siswa/materi', tugas: '/siswa/tugas', quiz: '/siswa/quiz', nilai: '/siswa/nilai' };
  out.siswa.halaman = {};
  for (const [k, p] of Object.entries(pages)) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    out.siswa.halaman[k] = {
      h1: await page.locator('h1').first().innerText().catch(() => null),
      baris: await page.locator('table tbody tr').count(),
      kartu: await page.locator('.card.mb').count(),
      kosong: (await page.locator('body').innerText()).includes('Belum ada'),
    };
  }
  await page.goto(BASE + '/siswa/materi', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'shot-siswa-materi.png' });

  // ---------- GURU ----------
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /Keluar|Logout|Profil/i }).first().click().catch(() => { });
  await page.waitForTimeout(1500);
  await page.context().clearCookies('http://localhost:3000');

  await login(page, 'guru@citra.sch.id', 'guru123');
  out.guru = { dashboard: await page.locator('h1').first().innerText() };
  out.guru.stats = await page.locator('.card .stat').allInnerTexts();

  const gpages = { materi: '/guru/materi', tugas: '/guru/tugas', quiz: '/guru/quiz', nilai: '/guru/nilai', siswa: '/guru/siswa' };
  out.guru.halaman = {};
  for (const [k, p] of Object.entries(gpages)) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    out.guru.halaman[k] = {
      h1: await page.locator('h1').first().innerText().catch(() => null),
      baris: await page.locator('table tbody tr').count(),
      kosong: (await page.locator('body').innerText()).includes('Belum ada'),
    };
  }
  await page.goto(BASE + '/guru/nilai', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'shot-guru-nilai.png' });

  return out;
}
