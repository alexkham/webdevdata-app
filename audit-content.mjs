// audit-content.mjs
//
// QA tool — static audit of ALL reference content, every language:
//   - required meta fields present, meta.slug matches filename
//   - meta.hasLiveDemo consistent with method.hasLiveDemo
//   - live entries have demoParams + cases (and an emulator file)
//   - related[] slugs resolve to real content files (cross-category via
//     the optional `category` field, cross-language via `language`)
//   - tryInTool hrefs point at real pages under pages/
//   - officialDocs href is a well-formed https URL on the language's
//     canonical docs host (docs.python.org, developer.mozilla.org, …)
//   - no HTML entities leaking into plain-text fields
//
// Usage: node audit-content.mjs

import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, 'content', 'reference');
const EMUS = path.join(__dirname, 'utils', 'emulators');
const PAGES = path.join(__dirname, 'pages');

// Canonical documentation host per language. A new language must be added
// here, which is deliberate — it stops a typo'd docs link slipping through.
const DOCS_HOST = {
  python:     /^https:\/\/docs\.python\.org\//,
  javascript: /^https:\/\/developer\.mozilla\.org\//,
};

const problems = [];
const warn = (id, msg) => problems.push(`${id}: ${msg}`);

// Collect every item first, so related[] can resolve across categories
// and languages.
const all = {}; // 'language/category' → Set(slugs)
const mods = []; // { language, category, slug, meta, method }

for (const lang of fs.readdirSync(CONTENT)) {
  const langDir = path.join(CONTENT, lang);
  if (!fs.statSync(langDir).isDirectory()) continue;
  // categories, plus one level of module folders (stdlib/json → 'stdlib/json')
  const cats = [];
  for (const c of fs.readdirSync(langDir)) {
    const d = path.join(langDir, c);
    if (!fs.statSync(d).isDirectory()) continue;
    cats.push(c);
    for (const sub of fs.readdirSync(d)) {
      if (fs.statSync(path.join(d, sub)).isDirectory()) cats.push(`${c}/${sub}`);
    }
  }
  for (const category of cats) {
    const dir = path.join(langDir, category);
    const key = `${lang}/${category}`;
    all[key] = new Set();
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
      const slug = f.replace(/\.js$/, '');
      all[key].add(slug);
      const mod = await import(pathToFileURL(path.join(dir, f)).href);
      mods.push({ language: lang, category, slug, meta: mod.meta, method: mod.method });
    }
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

for (const { language, category, slug, meta, method } of mods) {
  const id = `${language}/${category}/${slug}`;

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

  if (meta.hasLiveDemo && Array.isArray(method.modes)) {
    // Snippet demo (exception pages): every mode needs a template with a
    // placeholder per param, and at least one case.
    if (method.modes.length === 0) warn(id, 'live but modes[] is empty');
    for (const m of method.modes) {
      if (!m.id || !m.label || !m.template) warn(id, `mode '${m.id}' missing id/label/template`);
      if (!Array.isArray(m.cases) || m.cases.length === 0) warn(id, `mode '${m.id}' has no cases`);
      for (const p of m.params || []) {
        if (!String(m.template).includes(`{$${p.name}}`)) warn(id, `mode '${m.id}' param '${p.name}' not used in template`);
      }
    }
    if (!fs.existsSync(path.join(EMUS, language, category, `${slug}.js`))) warn(id, 'live but no emulator file');
  } else if (meta.hasLiveDemo) {
    if (!Array.isArray(method.demoParams) || method.demoParams.length === 0) warn(id, 'live but no demoParams');
    if (!Array.isArray(method.cases) || method.cases.length === 0) warn(id, 'live but no cases');
    if (!fs.existsSync(path.join(EMUS, language, category, `${slug}.js`))) warn(id, 'live but no emulator file');
  } else {
    if (fs.existsSync(path.join(EMUS, language, category, `${slug}.js`))) warn(id, 'doc-only but emulator file exists');
  }

  for (const r of method.related || []) {
    const lang = r.language || language;
    const cat = r.category || category;
    const key = `${lang}/${cat}`;
    // category 'stdlib' + a module name → that module's hub (stdlib/json/index.js)
    const isModuleHub = all[`${key}/${r.slug}`] && all[`${key}/${r.slug}`].has('index');
    if (!isModuleHub && (!all[key] || !all[key].has(r.slug))) {
      warn(id, `related '${r.name}' → ${key}/${r.slug} does not exist`);
    }
  }

  // tool links live ONLY in content/reference/tool-links.js (checked below)
  if (method.tryInTool !== undefined) {
    warn(id, 'has its own tryInTool — tool links belong in content/reference/tool-links.js');
  }

  const docs = method.officialDocs;
  const hostRe = DOCS_HOST[language];
  if (!hostRe) {
    warn(id, `no canonical docs host configured for language '${language}' — add one to DOCS_HOST`);
  } else if (!docs || !hostRe.test(docs.href || '')) {
    warn(id, `officialDocs missing or not on the expected host: ${docs && docs.href}`);
  }

  if (meta.type === 'exception' && (!Array.isArray(method.chain) || method.chain.length === 0)) {
    warn(id, 'exception page without method.chain');
  }
  if (meta.type === 'keyword') {
    if (!Array.isArray(method.syntax) || method.syntax.length === 0) warn(id, 'keyword page without method.syntax forms');
    if (!Array.isArray(method.covers) || method.covers.length === 0) warn(id, 'keyword page without method.covers');
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

// ── Reference ⇄ tools registry ──────────────────────────────
// Every link: a real reference page, a real tool page with a registered
// name, both notes written, no duplicate pair.
{
  const reg = await import(pathToFileURL(path.join(CONTENT, 'tool-links.js')).href);
  const seen = new Set();
  for (const l of reg.TOOL_LINKS) {
    const id = `tool-links ${l.tool} ⇄ ${l.page}`;
    const parts = l.page.split('/');
    const slug = parts.pop();
    const key = parts.join('/');
    if (!all[key] || !all[key].has(slug)) warn(id, 'reference page does not exist');
    if (!reg.TOOLS[l.tool]) warn(id, 'tool not registered in TOOLS');
    if (!pageExists(l.tool)) warn(id, 'tool page does not exist');
    if (!l.toolNote || !l.refNote) warn(id, 'toolNote and refNote are both required');
    if (seen.has(`${l.tool}|${l.page}`)) warn(id, 'duplicate link');
    seen.add(`${l.tool}|${l.page}`);
  }
}

// ── Report ───────────────────────────────────────────────────
const byLang = new Map();
for (const m of mods) byLang.set(m.language, (byLang.get(m.language) || 0) + 1);
const breakdown = [...byLang.entries()].sort().map(([l, n]) => `${l} ${n}`).join(', ');

console.log(`\n=== Content audit: ${mods.length} files (${breakdown}) ===`);
if (problems.length === 0) {
  console.log('CLEAN — no problems found');
} else {
  console.log(`${problems.length} problem(s):\n`);
  for (const p of problems) console.log('  ' + p);
}
process.exitCode = problems.length > 0 ? 1 : 0;
