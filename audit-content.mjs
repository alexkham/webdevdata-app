// audit-content.mjs
//
// QA tool — static audit of all reference content files:
//   - required meta fields present, meta.slug matches filename
//   - meta.hasLiveDemo consistent with method.hasLiveDemo
//   - live entries have demoParams + cases (and an emulator file)
//   - related[] slugs resolve to real content files (cross-category via
//     the optional category field)
//   - tryInTool hrefs point at real pages under pages/
//   - officialDocs href is a well-formed https URL
//   - no HTML entities leaking into plain-text fields
//
// Usage: node audit-content.mjs

import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, 'content', 'reference', 'python');
const EMUS = path.join(__dirname, 'utils', 'emulators', 'python');
const PAGES = path.join(__dirname, 'pages');

const problems = [];
const warn = (id, msg) => problems.push(`${id}: ${msg}`);

// collect all slugs per category first, for related-resolution
const all = {}; // category → Set(slugs)
const mods = []; // { category, slug, meta, method }
for (const category of fs.readdirSync(CONTENT)) {
  const dir = path.join(CONTENT, category);
  if (!fs.statSync(dir).isDirectory()) continue;
  all[category] = new Set();
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
    const slug = f.replace(/\.js$/, '');
    all[category].add(slug);
    const mod = await import(pathToFileURL(path.join(dir, f)).href);
    mods.push({ category, slug, meta: mod.meta, method: mod.method });
  }
}

const pageExists = (href) => {
  const clean = href.replace(/^\//, '').replace(/[?#].*$/, '');
  return (
    fs.existsSync(path.join(PAGES, clean + '.jsx')) ||
    fs.existsSync(path.join(PAGES, clean, 'index.jsx'))
  );
};

const ENTITY_RE = /&(quot|apos|amp|lt|gt|mdash|rarr|larr|hellip|asymp|middot|nbsp);/;

for (const { category, slug, meta, method } of mods) {
  const id = `${category}/${slug}`;

  if (!meta) { warn(id, 'no meta export'); continue; }
  if (!method) { warn(id, 'no method export'); continue; }

  for (const field of ['slug', 'name', 'signature', 'blurb', 'category', 'type', 'version', 'searchTerms']) {
    if (meta[field] === undefined || meta[field] === null || meta[field] === '') {
      warn(id, `meta.${field} missing/empty`);
    }
  }
  if (meta.slug !== slug) warn(id, `meta.slug '${meta.slug}' != filename '${slug}'`);
  if (typeof meta.hasLiveDemo !== 'boolean') warn(id, 'meta.hasLiveDemo not boolean');
  if (Boolean(meta.hasLiveDemo) !== Boolean(method.hasLiveDemo)) {
    warn(id, `hasLiveDemo mismatch: meta=${meta.hasLiveDemo} method=${method.hasLiveDemo}`);
  }

  if (meta.hasLiveDemo) {
    if (!Array.isArray(method.demoParams) || method.demoParams.length === 0) warn(id, 'live but no demoParams');
    if (!Array.isArray(method.cases) || method.cases.length === 0) warn(id, 'live but no cases');
    if (!fs.existsSync(path.join(EMUS, category, `${slug}.js`))) warn(id, 'live but no emulator file');
  } else {
    if (fs.existsSync(path.join(EMUS, category, `${slug}.js`))) warn(id, 'doc-only but emulator file exists');
  }

  for (const r of method.related || []) {
    const cat = r.category || category;
    if (!all[cat] || !all[cat].has(r.slug)) {
      warn(id, `related '${r.name}' → ${cat}/${r.slug} does not exist`);
    }
  }

  for (const t of method.tryInTool || []) {
    if (!pageExists(t.href)) warn(id, `tryInTool '${t.name}' → ${t.href} is not a page`);
  }

  const docs = method.officialDocs;
  if (!docs || !/^https:\/\/docs\.python\.org\//.test(docs.href || '')) {
    warn(id, `officialDocs missing or not docs.python.org: ${docs && docs.href}`);
  }

  // entity leaks in plain-text fields
  const textBits = [
    meta.blurb, method.subtitle, method.demoExplainer,
    ...(method.examples || []).flatMap((e) => [e.title, e.code, e.returns]),
    ...(method.cases || []).flatMap((c) => Object.values(c.values || {}).map(String)),
    ...(method.faq || []).flatMap((q) => [q.q, q.a]),
  ].filter((x) => typeof x === 'string');
  for (const bit of textBits) {
    if (ENTITY_RE.test(bit)) {
      warn(id, `HTML entity leak: ${bit.slice(0, 60)}`);
      break;
    }
  }
}

console.log(`\n=== Content audit: ${mods.length} files ===`);
if (problems.length === 0) {
  console.log('CLEAN — no problems found');
} else {
  console.log(`${problems.length} problem(s):\n`);
  for (const p of problems) console.log('  ' + p);
}
process.exitCode = problems.length > 0 ? 1 : 0;
