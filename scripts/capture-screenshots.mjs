/**
 * Full-page screenshot captures for the gallery.
 *
 *   npm i playwright && npx playwright install chromium
 *   node scripts/capture-screenshots.mjs
 *
 * Every examples/<file>.html is captured at a 1440x900 viewport:
 *  - CDN scripts and Google Fonts are inlined/cached locally first, so the
 *    capture is deterministic (no flaky CDN, fonts always render).
 *  - The page is walked top-to-bottom with wheel events driven to their
 *    target (Lenis/ScrollTrigger lag is settled out), freezing every pinned
 *    or scrubbed section at its completed state in the still.
 *  - before.html is captured once and copied into every pack folder.
 */
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.GALLERY_ROOT || path.resolve(scriptDir, '..');
const EX = path.join(ROOT, 'examples');
const OUT = path.join(ROOT, 'gallery');
const CACHE = path.join(scriptDir, '.capture-cache');
mkdirSync(CACHE, { recursive: true });

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36';

async function cachedFetch(url) {
  const key = createHash('sha1').update(url).digest('hex');
  const p = path.join(CACHE, key);
  try { return await readFile(p); } catch { /* miss */ }
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(p, buf);
  return buf;
}

const mimeFor = (url) => (url.endsWith('.ttf') ? 'font/ttf' : url.endsWith('.woff2') ? 'font/woff2' : 'font/woff');
const fontLinkRe = /<link[^>]*href="(https:\/\/fonts\.googleapis\.com\/css2[^"]*)"[^>]*>/g;
const scriptRe = /<script[^>]*src="(https:\/\/cdn\.jsdelivr\.net\/[^"]*)"[^>]*><\/script>/g;

/** Fully local copy of a demo: CDN scripts inlined, fonts inlined as data URLs. */
async function prepare(srcPath, outDir) {
  let html = await readFile(srcPath, 'utf8');
  const fontUrls = [...new Set([...html.matchAll(fontLinkRe)].map((m) => m[1]))];
  const fontCss = new Map();
  for (const url of fontUrls) {
    let css = (await cachedFetch(url)).toString('utf8');
    for (const fm of css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)) {
      const fbuf = await cachedFetch(fm[1]);
      css = css.replace(fm[0], `url(data:${mimeFor(fm[1])};base64,${fbuf.toString('base64')})`);
    }
    fontCss.set(url, css);
  }
  html = html.replace(fontLinkRe, (m, url) => `<style>${fontCss.get(url)}</style>`);
  const scriptUrls = [...new Set([...html.matchAll(scriptRe)].map((m) => m[1]))];
  for (const url of scriptUrls) {
    const js = (await cachedFetch(url)).toString('utf8').replace(/<\/script/g, '<\\/script');
    const re = new RegExp(`<script[^>]*src="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*><\\/script>`);
    html = html.replace(re, () => `<script>${js}</script>`);
  }
  await mkdir(outDir, { recursive: true });
  const out = path.join(outDir, path.basename(srcPath));
  await writeFile(out, html);
  return out;
}

const packs = [
  ['before.html', null],
  ['after.html', 'editorial-minimal'],
  ['brutalist-industrial.html', 'brutalist-industrial'],
  ['quiet-luxury.html', 'quiet-luxury'],
  ['dark-tech.html', 'dark-tech'],
  ['playful-color.html', 'playful-color'],
  ['retro-print.html', 'retro-print'],
  ['japanese-minimal.html', 'japanese-minimal'],
  ['neo-brutalism.html', 'neo-brutalism'],
  ['corporate-trust.html', 'corporate-trust'],
  ['cinematic-motion.html', 'cinematic-motion'],
];

const browser = await chromium.launch();
const preparedDir = path.join(scriptDir, '.capture-prepared');

for (const [file, pack] of packs) {
  const prepared = await prepare(path.join(EX, file), preparedDir);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('file://' + prepared, { waitUntil: 'load' });
  try { await page.evaluate(() => document.fonts.ready); } catch { /* offline demo */ }
  await page.waitForTimeout(2500);
  if (file === 'cinematic-motion.html') {
    try {
      await page.waitForFunction(() => window.gsap && window.ScrollTrigger && window.Lenis && window.Draggable && window.InertiaPlugin, null, { timeout: 10000 });
    } catch {
      console.error('motion stack did not initialize for', file);
      process.exit(1);
    }
  }

  const height = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  let y = 0;
  while (y < height) {
    await page.mouse.wheel(0, 600);
    y += 600;
    await page.waitForTimeout(160);
  }
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(1500);
    const at = await page.evaluate(() => window.scrollY + window.innerHeight);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    if (at >= total - 100) break;
    await page.mouse.wheel(0, Math.min(total - at + 200, 3000));
  }
  await page.waitForTimeout(1200);

  const dir = pack ? path.join(OUT, pack) : path.join(OUT, 'before');
  mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, pack ? 'after.png' : 'before.png'), fullPage: true });
  console.log('captured', pack || 'before');
  await page.close();
}

await browser.close();

const before = path.join(OUT, 'before', 'before.png');
for (const [, pack] of packs) {
  if (pack) copyFileSync(before, path.join(OUT, pack, 'before.png'));
}
console.log('before.png copied into all', packs.length - 1, 'pack folders');