// audit-build-output.mjs
//
// Checks the BUILT site rather than the source. Run after `npm run build`.
//
// Why this exists: Next 14.2.4's SWC compiles the string TEXT "\uD83D"
// (backslash, u, surrogate-range hex) into a real lone surrogate. The source
// is correct and every source-level audit passes, but the prerendered HTML
// ends up with U+FFFD where the client renders a surrogate, and hydration
// fails. Only the build output shows it, so only a build-output check can
// catch it. See the NOTE header in content/reference/javascript/methods/
// string-split.js for the workaround.
//
// Two checks:
//   1. no U+FFFD replacement character in any prerendered HTML page
//   2. every string in every page-data JSON file is well-formed Unicode
//      (no unpaired surrogates reaching the client as props)

import fs from 'fs';
import path from 'path';

const ROOT = path.join('.next', 'server', 'pages');
if (!fs.existsSync(ROOT)) {
  console.error('No build output at .next/server/pages — run `npm run build` first.');
  process.exit(1);
}

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html') || p.endsWith('.json')) files.push(p);
  }
})(ROOT);

const problems = [];
const route = (p) => '/' + path.relative(ROOT, p).split(path.sep).join('/').replace(/\.(html|json)$/, '');

for (const p of files) {
  const text = fs.readFileSync(p, 'utf8');
  if (p.endsWith('.html')) {
    const n = (text.match(/�/g) || []).length;
    if (n) {
      const i = text.indexOf('�');
      const ctx = text.slice(Math.max(0, i - 60), i + 20).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
      problems.push(`${route(p)}  HTML contains ${n} U+FFFD  …${ctx}…`);
    }
  } else {
    let data;
    try { data = JSON.parse(text); } catch { continue; }
    const bad = [];
    (function scan(v, where) {
      if (typeof v === 'string') { if (!v.isWellFormed()) bad.push(where); }
      else if (Array.isArray(v)) v.forEach((x, i) => scan(x, `${where}[${i}]`));
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) scan(x, `${where}.${k}`);
    })(data, 'props');
    if (bad.length) problems.push(`${route(p)}  page data has ${bad.length} malformed string(s), e.g. ${bad[0]}`);
  }
}

console.log('\n=== Build-output audit ===');
console.log(`files scanned: ${files.length} (${files.filter((f) => f.endsWith('.html')).length} html, ${files.filter((f) => f.endsWith('.json')).length} json)`);
if (problems.length) {
  console.log(`PROBLEMS: ${problems.length}`);
  problems.forEach((x) => console.log('  ' + x));
  process.exit(1);
}
console.log('CLEAN — no replacement characters, no malformed strings');
