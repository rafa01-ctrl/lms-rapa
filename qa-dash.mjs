const BASE = 'http://localhost:3000';

async function login(page, email) {
  await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
  await page.getByText(email).first().waitFor({ timeout: 30000 });
  await page.locator('button', { hasText: email }).first().click();
  await page.locator('input[type="password"]').first().waitFor({ timeout: 15000 });
  await page.getByRole('button', { name: 'Masuk' }).click();
  await page.waitForURL(BASE + '/', { timeout: 30000 }).catch(() => { });
  await page.waitForTimeout(5000);
}

export default async function run(page) {
  const out = {};

  await login(page, 'siswa@citra.sch.id');
  out.siswa = { h1: await page.locator('h1').first().innerText(), stats: await page.locator('.stat').allInnerTexts() };
  await page.screenshot({ path: 'shot-siswa-dash.png' });

  await page.context().clearCookies(BASE);
  await login(page, 'guru@citra.sch.id');
  out.guru = { h1: await page.locator('h1').first().innerText(), stats: await page.locator('.stat').allInnerTexts() };
  await page.screenshot({ path: 'shot-guru-dash.png' });

  return out;
}
