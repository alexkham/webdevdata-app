// generate-sitemap.mjs
// Generates public/sitemap.xml from the pages actually emitted by `next build`
// (.next/server/pages/**/*.html), so dynamic routes from getStaticPaths are included.
// Runs after `next build` (see package.json scripts).
// Usage: node generate-sitemap.mjs [--slug-to-exclude ...]
//   e.g. node generate-sitemap.mjs --draft

import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

const SITE_URL = 'https://www.webdevdata.net';
const BUILD_PAGES_DIR = '.next/server/pages';
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'sitemap.xml');

const PAGE_EXTENSIONS = ['.jsx', '.js', '.tsx', '.ts'];

// Scratch/test pages — any route segment starting with "test" is never published.
const isScratchRoute = (route) => route.split('/').some((seg) => seg.startsWith('test'));

const cliExcludes = process.argv.slice(2).map((arg) => arg.replace(/^--/, ''));

if (!fs.existsSync(path.join(process.cwd(), BUILD_PAGES_DIR))) {
  console.error(`Error: ${BUILD_PAGES_DIR} not found. Run \`next build\` first.`);
  process.exit(1);
}

const htmlFiles = await globby([
  `${BUILD_PAGES_DIR}/**/*.html`,
  `!${BUILD_PAGES_DIR}/404.html`,
  `!${BUILD_PAGES_DIR}/500.html`,
  `!${BUILD_PAGES_DIR}/**/_*.html`,
]);

// '.next/server/pages/python/functions/abs.html' -> '/python/functions/abs'
// '.next/server/pages/index.html' -> '/'
function toRoute(file) {
  let route = file.slice(BUILD_PAGES_DIR.length).replace(/\.html$/, '');
  if (route === '/index') route = '/';
  return route || '/';
}

// lastmod: mtime of the source page file if we can find it, else the built HTML, else now.
function lastmodFor(route, htmlFile) {
  const rel = route === '/' ? 'index' : route.slice(1);
  const candidates = [];
  for (const ext of PAGE_EXTENSIONS) {
    candidates.push(path.join(process.cwd(), 'pages', `${rel}${ext}`));
    candidates.push(path.join(process.cwd(), 'pages', rel, `index${ext}`));
  }
  if (route === '/') {
    for (const ext of PAGE_EXTENSIONS) {
      candidates.push(path.join(process.cwd(), 'app', `page${ext}`));
    }
  }
  for (const candidate of candidates) {
    try {
      return fs.statSync(candidate).mtime;
    } catch {
      // not this one — keep looking
    }
  }
  try {
    return fs.statSync(htmlFile).mtime;
  } catch {
    return new Date();
  }
}

const pages = htmlFiles
  .map((file) => ({ file, route: toRoute(file) }))
  .filter(({ route }) => !route.includes('/_index'))
  .filter(({ route }) => !isScratchRoute(route))
  .filter(({ route }) => !cliExcludes.some((slug) => route.split('/').includes(slug)));

// The homepage is the one live route served by the app router (app/page.js), so it
// builds to .next/server/app/index.html instead of .next/server/pages/. Special-case
// it here — all other routes live in pages/.
const APP_INDEX_HTML = path.join(process.cwd(), '.next', 'server', 'app', 'index.html');
if (!pages.some(({ route }) => route === '/') && fs.existsSync(APP_INDEX_HTML)) {
  pages.push({ file: APP_INDEX_HTML, route: '/' });
}

// Homepage at position 0, then alphabetical (keeps output idempotent).
pages.sort((a, b) => {
  if (a.route === '/') return -1;
  if (b.route === '/') return 1;
  return a.route.localeCompare(b.route);
});

const urls = pages
  .map(({ file, route }) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${lastmodFor(route, file).toISOString()}</lastmod>
  </url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(OUTPUT_FILE, sitemap);
console.log(`Sitemap generated at ${OUTPUT_FILE} (${pages.length} URLs)`);
