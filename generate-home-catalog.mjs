// // // generate-home-catalog.mjs  (v2 — no content in the script)
// // //
// // // Auto-generates data/home-catalog.js from the pages/ tree.
// // //
// // // The script contains NO content. Everything descriptive is pulled from
// // // the pages themselves:
// // //
// // //   - Pillar title  → seoData.name of the pillar's index page
// // //                     (pages/<pillar>/index.jsx), fallback: prettified slug
// // //   - Pillar blurb  → seoData.description of that index page
// // //   - Card name     → seoData.name of the page
// // //   - Card desc     → seoData.description of the page
// // //   - Breakdown     → counts by second-level folder
// // //   - Stats         → computed (page count, category count)
// // //
// // // Every content page follows the standard template and declares inside
// // // getStaticProps:
// // //
// // //   seoData: {
// // //     title: "...",
// // //     description: "...",
// // //     keywords: keyWords.join(", "),   // or a plain string literal
// // //     url: "/some/url",
// // //     name: "..."
// // //   }
// // //
// // // Presentational extras (CTA wording, brand stats like "0ms Server",
// // // featured ordering) do not belong here — apply them in pages/index.jsx
// // // on top of the generated catalog if ever needed.
// // //
// // // Wire into package.json:
// // //   "dev":   "node generate-home-catalog.mjs && next dev",
// // //   "build": "node generate-home-catalog.mjs && next build && node generate-sitemap.mjs"

// // import fs from 'fs';
// // import path from 'path';
// // import { fileURLToPath } from 'url';

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // const PAGES_DIR = path.join(__dirname, 'pages');
// // const OUTPUT_FILE = path.join(__dirname, 'data', 'home-catalog.js');

// // // ─────────────────────────────────────────────────────────────
// // // Mechanics-only configuration (no content)
// // // ─────────────────────────────────────────────────────────────

// // // Max cards emitted per pillar.
// // const CARDS_PER_PILLAR = 6;

// // // Max length of a card description before truncation.
// // const CARD_DESC_MAX = 110;

// // // Top-level entries under pages/ that never contribute to the catalog.
// // const EXCLUDED_TOP_LEVEL = new Set([
// //   'api',
// //   '_app',
// //   '_document',
// //   '_error',
// //   '404',
// //   '500',
// //   'index',
// //   'Layout',
// //   'sitemap',
// //   'robots',
// //   'privacy-policy',
// //   'terms-and-conditions',
// //   'cookie-policy',
// //   'disclaimer',
// // ]);

// // // CLI excludes: `node generate-home-catalog.mjs --draft --internal`
// // process.argv.slice(2).forEach((arg) => EXCLUDED_TOP_LEVEL.add(arg.replace('--', '')));

// // // Casing fixes for slugs the prettifier gets wrong. Mechanics, not content.
// // const LABEL_OVERRIDES = {
// //   sql: 'SQL',
// //   css: 'CSS',
// //   json: 'JSON',
// //   jwt: 'JWT',
// //   url: 'URL',
// //   html: 'HTML',
// //   api: 'API',
// //   faq: 'FAQ',
// //   'c-programming': 'C Programming',
// //   javascript: 'JavaScript',
// //   python: 'Python',
// //   regex: 'Regex',
// // };

// // // ─────────────────────────────────────────────────────────────
// // // Helpers — filesystem walk
// // // ─────────────────────────────────────────────────────────────

// // function prettify(slug) {
// //   if (LABEL_OVERRIDES[slug]) return LABEL_OVERRIDES[slug];
// //   return slug
// //     .split('-')
// //     .map((w) => (w.length === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
// //     .join(' ');
// // }

// // function isPageFile(name) {
// //   return /\.(jsx|tsx|js|ts)$/.test(name) && !/\.module\./.test(name);
// // }

// // function stripExt(name) {
// //   return name.replace(/\.(jsx|tsx|js|ts)$/, '');
// // }

// // // Recursively collect { filePath, route } for every static page.
// // function collectPages(dir, routePrefix, out, warnings) {
// //   for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
// //     const name = entry.name;

// //     if (entry.isDirectory()) {
// //       if (name.startsWith('_')) continue;
// //       if (name.includes('[')) {
// //         warnings.push(`[skip] dynamic route folder: ${routePrefix}/${name} (no static seoData)`);
// //         continue;
// //       }
// //       collectPages(path.join(dir, name), `${routePrefix}/${name}`, out, warnings);
// //       continue;
// //     }

// //     if (!entry.isFile() || !isPageFile(name)) continue;
// //     if (name.startsWith('_')) continue;

// //     const slug = stripExt(name);
// //     if (slug.includes('[')) {
// //       warnings.push(`[skip] dynamic route page: ${routePrefix}/${name} (no static seoData)`);
// //       continue;
// //     }

// //     const route = slug === 'index' ? (routePrefix || '/') : `${routePrefix}/${slug}`;
// //     out.push({ filePath: path.join(dir, name), route: route || '/' });
// //   }
// // }

// // // ─────────────────────────────────────────────────────────────
// // // Helpers — static extraction of seoData from source text
// // // ─────────────────────────────────────────────────────────────

// // // Scan a balanced { ... } block starting at `start` (index of the opening
// // // brace). String-, template- and comment-aware so braces inside quotes or
// // // comments don't break the depth count. Returns the block text incl. braces,
// // // or null.
// // function scanBalancedBraces(src, start) {
// //   let depth = 0;
// //   let i = start;
// //   let quote = null; // "'", '"', '`' when inside a string/template

// //   while (i < src.length) {
// //     const ch = src[i];
// //     const next = src[i + 1];

// //     if (quote) {
// //       if (ch === '\\') { i += 2; continue; }
// //       if (ch === quote) quote = null;
// //       i += 1;
// //       continue;
// //     }

// //     if (ch === "'" || ch === '"' || ch === '`') { quote = ch; i += 1; continue; }
// //     if (ch === '/' && next === '/') { const nl = src.indexOf('\n', i); i = nl === -1 ? src.length : nl + 1; continue; }
// //     if (ch === '/' && next === '*') { const end = src.indexOf('*/', i + 2); i = end === -1 ? src.length : end + 2; continue; }

// //     if (ch === '{') depth += 1;
// //     if (ch === '}') {
// //       depth -= 1;
// //       if (depth === 0) return src.slice(start, i + 1);
// //     }
// //     i += 1;
// //   }
// //   return null;
// // }

// // // Extract the seoData object literal text from a page source, or null.
// // function extractSeoBlock(src) {
// //   const m = src.match(/seoData\s*:\s*\{/);
// //   if (!m) return null;
// //   const braceStart = m.index + m[0].length - 1;
// //   return scanBalancedBraces(src, braceStart);
// // }

// // // Pull a string-literal field out of an object-literal text.
// // function getStringField(objText, key) {
// //   const re = new RegExp(`${key}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1)[\\s\\S])*?)\\1`);
// //   const m = objText.match(re);
// //   if (!m) return null;
// //   return m[2]
// //     .replace(/\\n/g, ' ')
// //     .replace(/\\(["'\`])/g, '$1')
// //     .replace(/\s+/g, ' ')
// //     .trim();
// // }

// // // Resolve the keywords field: plain string literal, or `keyWords.join(...)`
// // // resolved against the page's own `const keyWords = [...]`.
// // function getKeywords(seoBlock, src) {
// //   const literal = getStringField(seoBlock, 'keywords');
// //   if (literal !== null) return literal;

// //   if (/keywords\s*:\s*keyWords\s*\.\s*join\s*\(/.test(seoBlock)) {
// //     const arrMatch = src.match(/(?:const|let|var)\s+keyWords\s*=\s*\[([\s\S]*?)\]/);
// //     if (!arrMatch) return '';
// //     const items = [];
// //     const itemRe = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
// //     let im;
// //     while ((im = itemRe.exec(arrMatch[1])) !== null) {
// //       const v = im[2].trim();
// //       if (v.length > 0) items.push(v);
// //     }
// //     return items.join(', ');
// //   }
// //   return '';
// // }

// // const PLACEHOLDERS = new Set(['title', 'metadescription', 'name', '/url', 'url', '']);

// // function isPlaceholder(value) {
// //   return value === null || PLACEHOLDERS.has(String(value).trim().toLowerCase());
// // }

// // // Strip a trailing " | Site Name" from a title for card display.
// // function cleanTitle(title) {
// //   if (!title) return title;
// //   return title.split('|')[0].trim();
// // }

// // function truncate(text, max) {
// //   if (!text || text.length <= max) return text;
// //   const cut = text.slice(0, max);
// //   const lastSpace = cut.lastIndexOf(' ');
// //   return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trimEnd()}\u2026`;
// // }

// // // ─────────────────────────────────────────────────────────────
// // // Main
// // // ─────────────────────────────────────────────────────────────

// // function main() {
// //   if (!fs.existsSync(PAGES_DIR)) {
// //     console.error(`pages/ directory not found at ${PAGES_DIR}`);
// //     process.exit(1);
// //   }

// //   const warnings = [];
// //   const allPages = [];

// //   // Only descend into non-excluded top-level folders. Flat top-level
// //   // pages (privacy-policy etc.) never join a pillar.
// //   for (const entry of fs.readdirSync(PAGES_DIR, { withFileTypes: true })) {
// //     const name = entry.name;
// //     if (!entry.isDirectory()) continue;
// //     if (name.startsWith('_') || name.includes('[')) continue;
// //     if (EXCLUDED_TOP_LEVEL.has(name)) continue;
// //     collectPages(path.join(PAGES_DIR, name), `/${name}`, allPages, warnings);
// //   }

// //   // ── Extract seoData per page ──────────────────────────────
// //   const entries = [];
// //   for (const page of allPages) {
// //     const src = fs.readFileSync(page.filePath, 'utf8');
// //     const seoBlock = extractSeoBlock(src);
// //     const rel = path.relative(PAGES_DIR, page.filePath);

// //     if (!seoBlock) {
// //       warnings.push(`[warn] no seoData found: pages/${rel} — page skipped`);
// //       continue;
// //     }

// //     const title = getStringField(seoBlock, 'title');
// //     const description = getStringField(seoBlock, 'description');
// //     const name = getStringField(seoBlock, 'name');
// //     const declaredUrl = getStringField(seoBlock, 'url');
// //     const keywords = getKeywords(seoBlock, src);

// //     if (isPlaceholder(title) && isPlaceholder(name)) {
// //       warnings.push(`[warn] placeholder seoData (title/name unset): pages/${rel} — page skipped`);
// //       continue;
// //     }

// //     if (!isPlaceholder(declaredUrl) && declaredUrl !== page.route) {
// //       warnings.push(`[warn] seoData.url "${declaredUrl}" != filesystem route "${page.route}" in pages/${rel} — using filesystem route`);
// //     }

// //     const segments = page.route.split('/').filter(Boolean);
// //     const pillarSlug = segments[0];
// //     const subSlug = segments.length > 2 ? segments[1] : null;

// //     entries.push({
// //       route: page.route,
// //       pillarSlug,
// //       subSlug,
// //       isPillarIndex: segments.length === 1,
// //       title: cleanTitle(title) || name,
// //       name: isPlaceholder(name) ? cleanTitle(title) : name,
// //       description: isPlaceholder(description) ? '' : description,
// //       keywords,
// //     });
// //   }

// //   // ── Group into pillars ────────────────────────────────────
// //   const byPillar = new Map();
// //   for (const e of entries) {
// //     if (!byPillar.has(e.pillarSlug)) byPillar.set(e.pillarSlug, []);
// //     byPillar.get(e.pillarSlug).push(e);
// //   }

// //   const pillars = [];
// //   for (const [slug, pages] of byPillar.entries()) {
// //     const indexPage = pages.find((p) => p.isPillarIndex) || null;
// //     const contentPages = pages.filter((p) => !p.isPillarIndex);

// //     if (!indexPage) {
// //       warnings.push(`[warn] no index page with seoData for pillar "/${slug}" — using prettified slug as title, empty blurb`);
// //     }

// //     const pillarTitle =
// //       (indexPage && !isPlaceholder(indexPage.name) && indexPage.name) ||
// //       (indexPage && indexPage.title) ||
// //       prettify(slug);

// //     const pillarBlurb = (indexPage && indexPage.description) || '';

// //     // Sub-category breakdown
// //     const subCounts = new Map();
// //     for (const p of contentPages) {
// //       const label = p.subSlug ? prettify(p.subSlug) : 'General';
// //       subCounts.set(label, (subCounts.get(label) || 0) + 1);
// //     }
// //     const breakdown = [...subCounts.entries()]
// //       .map(([label, count]) => ({ label, count }))
// //       .sort((a, b) => b.count - a.count);

// //     // Stats — purely computed
// //     const stats = [
// //       { n: String(contentPages.length), label: 'Pages' },
// //       { n: String(breakdown.length), label: 'Categories' },
// //     ];

// //     // Cards — first N content pages in discovery order
// //     const cards = contentPages.slice(0, CARDS_PER_PILLAR).map((p) => ({
// //       name: p.name || p.title,
// //       desc: truncate(p.description, CARD_DESC_MAX),
// //       href: p.route,
// //       tag: p.subSlug ? prettify(p.subSlug) : prettify(slug),
// //       kicker: p.subSlug ? prettify(p.subSlug) : prettify(slug),
// //     }));

// //     pillars.push({
// //       id: slug,
// //       title: pillarTitle,
// //       href: `/${slug}`,
// //       blurb: pillarBlurb,
// //       cardsTitle: `Popular in ${pillarTitle}`,
// //       ctaLabel: `Browse ${pillarTitle}`,
// //       stats,
// //       breakdown,
// //       cards,
// //     });
// //   }

// //   pillars.sort((a, b) => a.title.localeCompare(b.title));

// //   // ── Emit ──────────────────────────────────────────────────
// //   const output = `// AUTO-GENERATED by generate-home-catalog.mjs
// // // Regenerated on every \`npm run dev\` and \`npm run build\`.
// // // Do NOT edit by hand — changes here are overwritten.
// // //
// // // Source of truth: the seoData objects inside each page under pages/.
// // // Pillar title/blurb come from the pillar's own index page seoData.

// // export const homeCatalog = {
// //   generatedAt: ${JSON.stringify(new Date().toISOString())},
// //   pillars: ${JSON.stringify(pillars, null, 2)}
// // };
// // `;

// //   fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
// //   fs.writeFileSync(OUTPUT_FILE, output);

// //   // ── Report ────────────────────────────────────────────────
// //   warnings.forEach((w) => console.warn(`  ${w}`));
// //   console.log(`\nHome catalog generated: ${pillars.length} pillar(s), ${entries.length} page(s)`);
// //   pillars.forEach((p) => {
// //     console.log(`  [${p.id}] ${p.title} — ${p.stats[0].n} pages, ${p.breakdown.length} sub-categorie(s), ${p.cards.length} card(s)`);
// //   });
// //   console.log(`\nWritten to: ${OUTPUT_FILE}\n`);
// // }

// // main();


// // generate-home-catalog.mjs
// //
// // Auto-generates data/home-catalog.js from the pages/ tree.
// //
// // The script contains NO content and truncates NOTHING. It is a source of
// // truth: every page of every pillar is emitted in full. How much to display
// // is a UI concern and is handled by the consuming components.
// //
// // Everything descriptive is pulled from the pages themselves:
// //
// //   - Pillar title  → seoData.name of the pillar's index page
// //                     (pages/<pillar>/index.jsx), fallback: prettified slug
// //   - Pillar blurb  → seoData.description of that index page
// //   - Page name     → seoData.name of the page
// //   - Page desc     → seoData.description of the page (full, untruncated)
// //   - Breakdown     → counts by second-level folder
// //   - Stats         → computed (page count, category count)
// //
// // Every content page follows the standard template and declares inside
// // getStaticProps:
// //
// //   seoData: {
// //     title: "...",
// //     description: "...",
// //     keywords: keyWords.join(", "),   // or a plain string literal
// //     url: "/some/url",
// //     name: "..."
// //   }
// //
// // Wire into package.json:
// //   "dev":   "node generate-home-catalog.mjs && next dev",
// //   "build": "node generate-home-catalog.mjs && next build && node generate-sitemap.mjs"

// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const PAGES_DIR = path.join(__dirname, 'pages');
// const OUTPUT_FILE = path.join(__dirname, 'data', 'home-catalog.js');

// // ─────────────────────────────────────────────────────────────
// // Mechanics-only configuration (no content, no limits)
// // ─────────────────────────────────────────────────────────────

// // Top-level entries under pages/ that never contribute to the catalog.
// const EXCLUDED_TOP_LEVEL = new Set([
//   'api',
//   '_app',
//   '_document',
//   '_error',
//   '404',
//   '500',
//   'index',
//   'Layout',
//   'sitemap',
//   'robots',
//   'privacy-policy',
//   'terms-and-conditions',
//   'cookie-policy',
//   'disclaimer',
// ]);

// // CLI excludes: `node generate-home-catalog.mjs --draft --internal`
// process.argv.slice(2).forEach((arg) => EXCLUDED_TOP_LEVEL.add(arg.replace('--', '')));

// // Casing fixes for slugs the prettifier gets wrong. Mechanics, not content.
// const LABEL_OVERRIDES = {
//   sql: 'SQL',
//   css: 'CSS',
//   json: 'JSON',
//   jwt: 'JWT',
//   url: 'URL',
//   html: 'HTML',
//   api: 'API',
//   faq: 'FAQ',
//   'c-programming': 'C Programming',
//   javascript: 'JavaScript',
//   python: 'Python',
//   regex: 'Regex',
// };

// // ─────────────────────────────────────────────────────────────
// // Helpers — filesystem walk
// // ─────────────────────────────────────────────────────────────

// function prettify(slug) {
//   if (LABEL_OVERRIDES[slug]) return LABEL_OVERRIDES[slug];
//   return slug
//     .split('-')
//     .map((w) => (w.length === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
//     .join(' ');
// }

// function isPageFile(name) {
//   return /\.(jsx|tsx|js|ts)$/.test(name) && !/\.module\./.test(name);
// }

// function stripExt(name) {
//   return name.replace(/\.(jsx|tsx|js|ts)$/, '');
// }

// // Recursively collect { filePath, route } for every static page.
// function collectPages(dir, routePrefix, out, warnings) {
//   for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
//     const name = entry.name;

//     if (entry.isDirectory()) {
//       if (name.startsWith('_')) continue;
//       if (name.includes('[')) {
//         warnings.push(`[skip] dynamic route folder: ${routePrefix}/${name} (no static seoData)`);
//         continue;
//       }
//       collectPages(path.join(dir, name), `${routePrefix}/${name}`, out, warnings);
//       continue;
//     }

//     if (!entry.isFile() || !isPageFile(name)) continue;
//     if (name.startsWith('_')) continue;

//     const slug = stripExt(name);
//     if (slug.includes('[')) {
//       warnings.push(`[skip] dynamic route page: ${routePrefix}/${name} (no static seoData)`);
//       continue;
//     }

//     const route = slug === 'index' ? (routePrefix || '/') : `${routePrefix}/${slug}`;
//     out.push({ filePath: path.join(dir, name), route: route || '/' });
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // Helpers — static extraction of seoData from source text
// // ─────────────────────────────────────────────────────────────

// // Scan a balanced { ... } block starting at `start` (index of the opening
// // brace). String-, template- and comment-aware so braces inside quotes or
// // comments don't break the depth count. Returns the block text incl. braces,
// // or null.
// function scanBalancedBraces(src, start) {
//   let depth = 0;
//   let i = start;
//   let quote = null; // "'", '"', '`' when inside a string/template

//   while (i < src.length) {
//     const ch = src[i];
//     const next = src[i + 1];

//     if (quote) {
//       if (ch === '\\') { i += 2; continue; }
//       if (ch === quote) quote = null;
//       i += 1;
//       continue;
//     }

//     if (ch === "'" || ch === '"' || ch === '`') { quote = ch; i += 1; continue; }
//     if (ch === '/' && next === '/') { const nl = src.indexOf('\n', i); i = nl === -1 ? src.length : nl + 1; continue; }
//     if (ch === '/' && next === '*') { const end = src.indexOf('*/', i + 2); i = end === -1 ? src.length : end + 2; continue; }

//     if (ch === '{') depth += 1;
//     if (ch === '}') {
//       depth -= 1;
//       if (depth === 0) return src.slice(start, i + 1);
//     }
//     i += 1;
//   }
//   return null;
// }

// // Extract the seoData object literal text from a page source, or null.
// function extractSeoBlock(src) {
//   const m = src.match(/seoData\s*:\s*\{/);
//   if (!m) return null;
//   const braceStart = m.index + m[0].length - 1;
//   return scanBalancedBraces(src, braceStart);
// }

// // Pull a string-literal field out of an object-literal text.
// function getStringField(objText, key) {
//   const re = new RegExp(`${key}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1)[\\s\\S])*?)\\1`);
//   const m = objText.match(re);
//   if (!m) return null;
//   return m[2]
//     .replace(/\\n/g, ' ')
//     .replace(/\\(["'\`])/g, '$1')
//     .replace(/\s+/g, ' ')
//     .trim();
// }

// // Resolve the keywords field: plain string literal, or `keyWords.join(...)`
// // resolved against the page's own `const keyWords = [...]`.
// function getKeywords(seoBlock, src) {
//   const literal = getStringField(seoBlock, 'keywords');
//   if (literal !== null) return literal;

//   if (/keywords\s*:\s*keyWords\s*\.\s*join\s*\(/.test(seoBlock)) {
//     const arrMatch = src.match(/(?:const|let|var)\s+keyWords\s*=\s*\[([\s\S]*?)\]/);
//     if (!arrMatch) return '';
//     const items = [];
//     const itemRe = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
//     let im;
//     while ((im = itemRe.exec(arrMatch[1])) !== null) {
//       const v = im[2].trim();
//       if (v.length > 0) items.push(v);
//     }
//     return items.join(', ');
//   }
//   return '';
// }

// const PLACEHOLDERS = new Set(['title', 'metadescription', 'name', '/url', 'url', '']);

// function isPlaceholder(value) {
//   return value === null || PLACEHOLDERS.has(String(value).trim().toLowerCase());
// }

// // Strip a trailing " | Site Name" from a title for display purposes.
// function cleanTitle(title) {
//   if (!title) return title;
//   return title.split('|')[0].trim();
// }

// // ─────────────────────────────────────────────────────────────
// // Main
// // ─────────────────────────────────────────────────────────────

// function main() {
//   if (!fs.existsSync(PAGES_DIR)) {
//     console.error(`pages/ directory not found at ${PAGES_DIR}`);
//     process.exit(1);
//   }

//   const warnings = [];
//   const allPages = [];

//   // Only descend into non-excluded top-level folders. Flat top-level
//   // pages (privacy-policy etc.) never join a pillar.
//   for (const entry of fs.readdirSync(PAGES_DIR, { withFileTypes: true })) {
//     const name = entry.name;
//     if (!entry.isDirectory()) continue;
//     if (name.startsWith('_') || name.includes('[')) continue;
//     if (EXCLUDED_TOP_LEVEL.has(name)) continue;
//     collectPages(path.join(PAGES_DIR, name), `/${name}`, allPages, warnings);
//   }

//   // ── Extract seoData per page ──────────────────────────────
//   const entries = [];
//   for (const page of allPages) {
//     const src = fs.readFileSync(page.filePath, 'utf8');
//     const seoBlock = extractSeoBlock(src);
//     const rel = path.relative(PAGES_DIR, page.filePath);

//     if (!seoBlock) {
//       warnings.push(`[warn] no seoData found: pages/${rel} — page skipped`);
//       continue;
//     }

//     const title = getStringField(seoBlock, 'title');
//     const description = getStringField(seoBlock, 'description');
//     const name = getStringField(seoBlock, 'name');
//     const declaredUrl = getStringField(seoBlock, 'url');
//     const keywords = getKeywords(seoBlock, src);

//     if (isPlaceholder(title) && isPlaceholder(name)) {
//       warnings.push(`[warn] placeholder seoData (title/name unset): pages/${rel} — page skipped`);
//       continue;
//     }

//     if (!isPlaceholder(declaredUrl) && declaredUrl !== page.route) {
//       warnings.push(`[warn] seoData.url "${declaredUrl}" != filesystem route "${page.route}" in pages/${rel} — using filesystem route`);
//     }

//     const segments = page.route.split('/').filter(Boolean);
//     const pillarSlug = segments[0];
//     const subSlug = segments.length > 2 ? segments[1] : null;

//     entries.push({
//       route: page.route,
//       pillarSlug,
//       subSlug,
//       isPillarIndex: segments.length === 1,
//       title: cleanTitle(title) || name,
//       name: isPlaceholder(name) ? cleanTitle(title) : name,
//       description: isPlaceholder(description) ? '' : description,
//       keywords,
//     });
//   }

//   // ── Group into pillars ────────────────────────────────────
//   const byPillar = new Map();
//   for (const e of entries) {
//     if (!byPillar.has(e.pillarSlug)) byPillar.set(e.pillarSlug, []);
//     byPillar.get(e.pillarSlug).push(e);
//   }

//   const pillars = [];
//   for (const [slug, pagesOfPillar] of byPillar.entries()) {
//     const indexPage = pagesOfPillar.find((p) => p.isPillarIndex) || null;
//     const contentPages = pagesOfPillar.filter((p) => !p.isPillarIndex);

//     if (!indexPage) {
//       warnings.push(`[warn] no index page with seoData for pillar "/${slug}" — using prettified slug as title, empty blurb`);
//     }

//     const pillarTitle =
//       (indexPage && !isPlaceholder(indexPage.name) && indexPage.name) ||
//       (indexPage && indexPage.title) ||
//       prettify(slug);

//     const pillarBlurb = (indexPage && indexPage.description) || '';

//     // Sub-category breakdown
//     const subCounts = new Map();
//     for (const p of contentPages) {
//       const label = p.subSlug ? prettify(p.subSlug) : 'General';
//       subCounts.set(label, (subCounts.get(label) || 0) + 1);
//     }
//     const breakdown = [...subCounts.entries()]
//       .map(([label, count]) => ({ label, count }))
//       .sort((a, b) => b.count - a.count);

//     // Stats — purely computed
//     const stats = [
//       { n: String(contentPages.length), label: 'Pages' },
//       { n: String(breakdown.length), label: 'Categories' },
//     ];

//     // Full page list — every page, full description, nothing cut
//     const pages = contentPages.map((p) => ({
//       name: p.name || p.title,
//       desc: p.description,
//       href: p.route,
//       sub: p.subSlug ? prettify(p.subSlug) : 'General',
//     }));

//     pillars.push({
//       id: slug,
//       title: pillarTitle,
//       href: `/${slug}`,
//       blurb: pillarBlurb,
//       ctaLabel: `Browse ${pillarTitle}`,
//       stats,
//       breakdown,
//       pages,
//     });
//   }

//   pillars.sort((a, b) => a.title.localeCompare(b.title));

//   // ── Emit ──────────────────────────────────────────────────
//   const output = `// AUTO-GENERATED by generate-home-catalog.mjs
// // Regenerated on every \`npm run dev\` and \`npm run build\`.
// // Do NOT edit by hand — changes here are overwritten.
// //
// // Source of truth: the seoData objects inside each page under pages/.
// // Pillar title/blurb come from the pillar's own index page seoData.
// // Contains the COMPLETE page list per pillar — nothing truncated.

// export const homeCatalog = {
//   generatedAt: ${JSON.stringify(new Date().toISOString())},
//   pillars: ${JSON.stringify(pillars, null, 2)}
// };
// `;

//   fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
//   fs.writeFileSync(OUTPUT_FILE, output);

//   // ── Report ────────────────────────────────────────────────
//   warnings.forEach((w) => console.warn(`  ${w}`));
//   console.log(`\nHome catalog generated: ${pillars.length} pillar(s), ${entries.length} page(s)`);
//   pillars.forEach((p) => {
//     console.log(`  [${p.id}] ${p.title} — ${p.pages.length} page(s), ${p.breakdown.length} sub-categorie(s)`);
//   });
//   console.log(`\nWritten to: ${OUTPUT_FILE}\n`);
// }

// main();


// generate-home-catalog.mjs  (v3 — full page list, nothing truncated)
//
// Auto-generates data/home-catalog.js from the pages/ tree.
//
// The script contains NO content and truncates NOTHING. It is a source of
// truth: every page of every pillar is emitted in full. How much to display
// is a UI concern and is handled by the consuming components.
//
// Everything descriptive is pulled from the pages themselves:
//
//   - Pillar title  → seoData.name of the pillar's index page
//                     (pages/<pillar>/index.jsx), fallback: prettified slug
//   - Pillar blurb  → seoData.description of that index page
//   - Page name     → seoData.name of the page
//   - Page desc     → seoData.description of the page (full, untruncated)
//   - Breakdown     → counts by second-level folder
//   - Stats         → computed (page count, category count)
//
// Every content page follows the standard template and declares inside
// getStaticProps:
//
//   seoData: {
//     title: "...",
//     description: "...",
//     keywords: keyWords.join(", "),   // or a plain string literal
//     url: "/some/url",
//     name: "..."
//   }
//
// Wire into package.json:
//   "dev":   "node generate-home-catalog.mjs && next dev",
//   "build": "node generate-home-catalog.mjs && next build && node generate-sitemap.mjs"

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, 'pages');
const OUTPUT_FILE = path.join(__dirname, 'data', 'home-catalog.js');

// ─────────────────────────────────────────────────────────────
// Mechanics-only configuration (no content, no limits)
// ─────────────────────────────────────────────────────────────

// Top-level entries under pages/ that never contribute to the catalog.
const EXCLUDED_TOP_LEVEL = new Set([
  'api',
  '_app',
  '_document',
  '_error',
  '404',
  '500',
  'index',
  'Layout',
  'sitemap',
  'robots',
  'privacy-policy',
  'terms-and-conditions',
  'cookie-policy',
  'disclaimer',
]);

// Anything starting with "test" is a scratch page — excluded at any depth.
const isScratch = (name) => name.startsWith('test');

// CLI excludes: `node generate-home-catalog.mjs --draft --internal`
process.argv.slice(2).forEach((arg) => EXCLUDED_TOP_LEVEL.add(arg.replace('--', '')));

// Casing fixes for slugs the prettifier gets wrong. Mechanics, not content.
const LABEL_OVERRIDES = {
  sql: 'SQL',
  css: 'CSS',
  json: 'JSON',
  jwt: 'JWT',
  url: 'URL',
  html: 'HTML',
  api: 'API',
  faq: 'FAQ',
  'c-programming': 'C Programming',
  javascript: 'JavaScript',
  python: 'Python',
  regex: 'Regex',
};

// ─────────────────────────────────────────────────────────────
// Helpers — filesystem walk
// ─────────────────────────────────────────────────────────────

function prettify(slug) {
  if (LABEL_OVERRIDES[slug]) return LABEL_OVERRIDES[slug];
  return slug
    .split('-')
    .map((w) => (w.length === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function isPageFile(name) {
  return /\.(jsx|tsx|js|ts)$/.test(name) && !/\.module\./.test(name);
}

function stripExt(name) {
  return name.replace(/\.(jsx|tsx|js|ts)$/, '');
}

// Recursively collect { filePath, route } for every static page.
function collectPages(dir, routePrefix, out, warnings) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = entry.name;

    if (entry.isDirectory()) {
      if (name.startsWith('_') || isScratch(name)) continue;
      if (name.includes('[')) {
        warnings.push(`[skip] dynamic route folder: ${routePrefix}/${name} (no static seoData)`);
        continue;
      }
      collectPages(path.join(dir, name), `${routePrefix}/${name}`, out, warnings);
      continue;
    }

    if (!entry.isFile() || !isPageFile(name)) continue;
    if (name.startsWith('_')) continue;

    const slug = stripExt(name);
    if (slug !== 'index' && isScratch(slug)) continue;
    if (slug.includes('[')) {
      warnings.push(`[skip] dynamic route page: ${routePrefix}/${name} (no static seoData)`);
      continue;
    }

    const route = slug === 'index' ? (routePrefix || '/') : `${routePrefix}/${slug}`;
    out.push({ filePath: path.join(dir, name), route: route || '/' });
  }
}

// ─────────────────────────────────────────────────────────────
// Helpers — static extraction of seoData from source text
// ─────────────────────────────────────────────────────────────

// Scan a balanced { ... } block starting at `start` (index of the opening
// brace). String-, template- and comment-aware so braces inside quotes or
// comments don't break the depth count. Returns the block text incl. braces,
// or null.
function scanBalancedBraces(src, start) {
  let depth = 0;
  let i = start;
  let quote = null; // "'", '"', '`' when inside a string/template

  while (i < src.length) {
    const ch = src[i];
    const next = src[i + 1];

    if (quote) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === quote) quote = null;
      i += 1;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; i += 1; continue; }
    if (ch === '/' && next === '/') { const nl = src.indexOf('\n', i); i = nl === -1 ? src.length : nl + 1; continue; }
    if (ch === '/' && next === '*') { const end = src.indexOf('*/', i + 2); i = end === -1 ? src.length : end + 2; continue; }

    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return src.slice(start, i + 1);
    }
    i += 1;
  }
  return null;
}

// Extract the seoData object literal text from a page source, or null.
// Matches both inline `seoData: {...}` and `const seoData = {...}` passed
// to props via shorthand.
function extractSeoBlock(src) {
  const m = src.match(/seoData\s*[:=]\s*\{/);
  if (!m) return null;
  const braceStart = m.index + m[0].length - 1;
  return scanBalancedBraces(src, braceStart);
}

// Pull a string-literal field out of an object-literal text. The leading
// boundary keeps `title` from matching `subtitle`, `category` from
// matching `applicationCategory`, etc.
function getStringField(objText, key) {
  const re = new RegExp(`(?:^|[^\\w$])${key}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1)[\\s\\S])*?)\\1`);
  const m = objText.match(re);
  if (!m) return null;
  return m[2]
    .replace(/\\n/g, ' ')
    .replace(/\\(["'\`])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

// Resolve the keywords field: plain string literal, or `keyWords.join(...)`
// resolved against the page's own `const keyWords = [...]`.
function getKeywords(seoBlock, src) {
  const literal = getStringField(seoBlock, 'keywords');
  if (literal !== null) return literal;

  if (/keywords\s*:\s*keyWords\s*\.\s*join\s*\(/.test(seoBlock)) {
    const arrMatch = src.match(/(?:const|let|var)\s+keyWords\s*=\s*\[([\s\S]*?)\]/);
    if (!arrMatch) return '';
    const items = [];
    const itemRe = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
    let im;
    while ((im = itemRe.exec(arrMatch[1])) !== null) {
      const v = im[2].trim();
      if (v.length > 0) items.push(v);
    }
    return items.join(', ');
  }
  return '';
}

const PLACEHOLDERS = new Set(['title', 'metadescription', 'name', '/url', 'url', '']);

function isPlaceholder(value) {
  return value === null || PLACEHOLDERS.has(String(value).trim().toLowerCase());
}

// Strip a trailing " | Site Name" from a title for display purposes.
function cleanTitle(title) {
  if (!title) return title;
  return title.split('|')[0].trim();
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`pages/ directory not found at ${PAGES_DIR}`);
    process.exit(1);
  }

  const warnings = [];
  const allPages = [];

  // Only descend into non-excluded top-level folders. Flat top-level
  // pages (privacy-policy etc.) never join a pillar.
  for (const entry of fs.readdirSync(PAGES_DIR, { withFileTypes: true })) {
    const name = entry.name;
    if (!entry.isDirectory()) continue;
    if (name.startsWith('_') || name.includes('[')) continue;
    if (EXCLUDED_TOP_LEVEL.has(name) || isScratch(name)) continue;
    collectPages(path.join(PAGES_DIR, name), `/${name}`, allPages, warnings);
  }

  // ── Extract seoData per page ──────────────────────────────
  const entries = [];
  for (const page of allPages) {
    const src = fs.readFileSync(page.filePath, 'utf8');
    const seoBlock = extractSeoBlock(src);
    const rel = path.relative(PAGES_DIR, page.filePath);

    if (!seoBlock) {
      warnings.push(`[warn] no seoData found: pages/${rel} — page skipped`);
      continue;
    }

    const title = getStringField(seoBlock, 'title');
    const description = getStringField(seoBlock, 'description');
    const name = getStringField(seoBlock, 'name');
    const declaredUrl = getStringField(seoBlock, 'url');
    const keywords = getKeywords(seoBlock, src);
    const category = getStringField(seoBlock, 'category');
    const subCategory = getStringField(seoBlock, 'subCategory');

    if (isPlaceholder(title) && isPlaceholder(name)) {
      warnings.push(`[warn] placeholder seoData (title/name unset): pages/${rel} — page skipped`);
      continue;
    }

    if (!isPlaceholder(declaredUrl) && declaredUrl !== page.route) {
      warnings.push(`[warn] seoData.url "${declaredUrl}" != filesystem route "${page.route}" in pages/${rel} — using filesystem route`);
    }

    const segments = page.route.split('/').filter(Boolean);
    const pillarSlug = segments[0];
    const subSlug = segments.length > 2 ? segments[1] : null;

    entries.push({
      route: page.route,
      pillarSlug,
      subSlug,
      isPillarIndex: segments.length === 1,
      title: cleanTitle(title) || name,
      name: isPlaceholder(name) ? cleanTitle(title) : name,
      description: isPlaceholder(description) ? '' : description,
      keywords,
      category: category || null,
      subCategory: subCategory || null,
    });
  }

  // ── Group into pillars ────────────────────────────────────
  const byPillar = new Map();
  for (const e of entries) {
    if (!byPillar.has(e.pillarSlug)) byPillar.set(e.pillarSlug, []);
    byPillar.get(e.pillarSlug).push(e);
  }

  const pillars = [];
  for (const [slug, pagesOfPillar] of byPillar.entries()) {
    const indexPage = pagesOfPillar.find((p) => p.isPillarIndex) || null;
    const contentPages = pagesOfPillar.filter((p) => !p.isPillarIndex);

    if (!indexPage) {
      warnings.push(`[warn] no index page with seoData for pillar "/${slug}" — using prettified slug as title, empty blurb`);
    }

    const pillarTitle =
      (indexPage && !isPlaceholder(indexPage.name) && indexPage.name) ||
      (indexPage && indexPage.title) ||
      prettify(slug);

    const pillarBlurb = (indexPage && indexPage.description) || '';

    // Sub-category breakdown
    const subCounts = new Map();
    for (const p of contentPages) {
      const label = p.subSlug ? prettify(p.subSlug) : 'General';
      subCounts.set(label, (subCounts.get(label) || 0) + 1);
    }
    const breakdown = [...subCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    // Stats — purely computed
    const stats = [
      { n: String(contentPages.length), label: 'Pages' },
      { n: String(breakdown.length), label: 'Categories' },
    ];

    // Full page list — every page, full description, nothing cut.
    // Category: declared seoData.category wins; folder-derived fallback.
    const pages = contentPages.map((p) => ({
      name: p.name || p.title,
      desc: p.description,
      href: p.route,
      category: p.category || (p.subSlug ? prettify(p.subSlug) : 'General'),
      subCategory: p.subCategory || null,
    }));

    pillars.push({
      id: slug,
      title: pillarTitle,
      href: `/${slug}`,
      blurb: pillarBlurb,
      ctaLabel: `Browse ${pillarTitle}`,
      stats,
      breakdown,
      pages,
    });
  }

  pillars.sort((a, b) => a.title.localeCompare(b.title));

  // ── Emit ──────────────────────────────────────────────────
  const output = `// AUTO-GENERATED by generate-home-catalog.mjs
// Regenerated on every \`npm run dev\` and \`npm run build\`.
// Do NOT edit by hand — changes here are overwritten.
//
// Source of truth: the seoData objects inside each page under pages/.
// Pillar title/blurb come from the pillar's own index page seoData.
// Contains the COMPLETE page list per pillar — nothing truncated.

export const homeCatalog = {
  generatedAt: ${JSON.stringify(new Date().toISOString())},
  pillars: ${JSON.stringify(pillars, null, 2)}
};
`;

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, output);

  // ── Report ────────────────────────────────────────────────
  warnings.forEach((w) => console.warn(`  ${w}`));
  console.log(`\nHome catalog generated: ${pillars.length} pillar(s), ${entries.length} page(s)`);
  pillars.forEach((p) => {
    console.log(`  [${p.id}] ${p.title} — ${p.pages.length} page(s), ${p.breakdown.length} sub-categorie(s)`);
  });
  console.log(`\nWritten to: ${OUTPUT_FILE}\n`);
}

main();