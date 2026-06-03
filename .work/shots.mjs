import { chromium } from 'playwright';
const BASE = 'http://localhost:4188';
const OUT = '.work/shots';
import { mkdirSync } from 'fs';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function shot(name, { path, theme='light', lang='ar', width=1280, height=900, full=true, prep } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  await ctx.addInitScript(([t,l]) => {
    localStorage.setItem('marja:theme', t);
    localStorage.setItem('marja:lang', l);
  }, [theme, lang]);
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await page.waitForTimeout(700);
  if (prep) await prep(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  await ctx.close();
  console.log('shot', name);
}

await shot('01-home-light',      { path: '/' });
await shot('02-home-dark',       { path: '/', theme: 'dark' });
await shot('03-article-3',       { path: '/article/3' });
await shot('04-article-84',      { path: '/article/84' });
await shot('05-calculator',      { path: '/calculators/end-of-service', prep: async (p) => {
  const nums = p.locator('input[type=number]');
  await nums.nth(0).fill('8000');
  await nums.nth(1).fill('8');
}});
await shot('06-index-map',       { path: '/index' });
await shot('07-coverage',        { path: '/coverage' });
await shot('08-scenarios',       { path: '/start' });
await shot('09-home-mobile',     { path: '/', width: 390, height: 844 });
await shot('10-article-mobile',  { path: '/article/3', width: 390, height: 844 });

await browser.close();
console.log('done');
