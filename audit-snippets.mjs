// audit-snippets.mjs
//
// QA tool — NOT part of the build. For content sections whose static
// snippets are required to be runnable (VERIFIED below):
//
//   EXAMPLE  every examples[].code, run through CPython, must print
//            exactly examples[].returns
//   PITFALL  every pitfalls[].wrong/fix .code must print exactly .output
//   PATTERN  every patterns[].code must at least compile (patterns are
//            fragments that reference the reader's own names)
//   CHAIN    method.chain must equal the class's real __mro__ (Python
//            exception pages)
//   COVERAGE every public built-in exception class must be covered — by a
//            page whose meta.name is the class, or by the class name in
//            the searchTerms of a page in the SAME category (strict form;
//            a naive text search over-credits).
//            Every keyword.kwlist + softkwlist entry must be claimed by a
//            keyword page's method.covers (and be in that page's
//            searchTerms), or be one of the keywords documented as
//            operators (and/or/not/in/is — the operator page must exist).
//
// Output rules for "prints": see audit-pysnippets.mjs (stdout, then the
// repr of a final non-None expression, then an uncaught exception's
// traceback last line).
//
// Usage: node audit-snippets.mjs [--verbose]

import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { runPythonSnippets } from './audit-pysnippets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, 'content', 'reference');
const VERBOSE = process.argv.includes('--verbose');

// language/category folders whose snippets must run
// (a folder's module sub-folders are verified too: python/stdlib/json, …)
const VERIFIED = ['python/exceptions', 'python/keywords', 'python/stdlib'];

const folders = [];
for (const rel of VERIFIED) {
  const dir = path.join(CONTENT, rel);
  if (!fs.existsSync(dir)) continue;
  folders.push(rel);
  for (const sub of fs.readdirSync(dir)) {
    if (fs.statSync(path.join(dir, sub)).isDirectory()) folders.push(`${rel}/${sub}`);
  }
}

const pages = [];
for (const rel of folders) {
  const dir = path.join(CONTENT, rel);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
    const mod = await import(pathToFileURL(path.join(dir, f)).href);
    pages.push({ rel, slug: f.replace(/\.js$/, ''), meta: mod.meta, method: mod.method });
  }
}

// ── Collect snippets ─────────────────────────────────────────
const runs = [];     // { id, code, expected, kind }
const compiles = []; // { id, code }
for (const { rel, slug, method } of pages) {
  const base = `${rel}/${slug}`;
  (method.examples || []).forEach((ex, i) => {
    runs.push({ id: `${base} example#${i + 1} "${ex.title}"`, code: ex.code, expected: ex.returns, kind: 'EXAMPLE' });
  });
  (method.pitfalls || []).forEach((p, i) => {
    for (const side of ['wrong', 'fix']) {
      if (!p[side]) continue;
      runs.push({ id: `${base} pitfall#${i + 1}.${side} "${p.name}"`, code: p[side].code, expected: p[side].output, kind: 'PITFALL' });
    }
  });
  (method.patterns || []).forEach((p, i) => {
    compiles.push({ id: `${base} pattern#${i + 1} "${p.name}"`, code: p.code });
  });
}

const results = runPythonSnippets(runs.map((r) => ({ id: r.id, code: r.code, mode: 'snippet' })));

const fails = { EXAMPLE: [], PITFALL: [], PATTERN: [], CHAIN: [], COVERAGE: [], KWCOVERAGE: [], MODCOVERAGE: [] };
let pass = 0;
for (const r of runs) {
  const got = results.get(r.id);
  if (got === r.expected) { pass += 1; continue; }
  fails[r.kind].push(`${r.id}\n    expected: ${JSON.stringify(r.expected)}\n    python:   ${JSON.stringify(got)}`);
}

// ── Python-side facts: compile checks, MROs, builtin surface ─
const py = `
import builtins, json, sys
data = json.load(open(sys.argv[1], encoding='utf-8'))
import keyword
out = {'compile': {}, 'mro': {}, 'surface': [], 'keywords': keyword.kwlist + keyword.softkwlist}
for c in data['compiles']:
    try:
        compile(c['code'], '<pattern>', 'exec')
        out['compile'][c['id']] = None
    except SyntaxError as e:
        out['compile'][c['id']] = f'{type(e).__name__}: {e.msg} (line {e.lineno})'
import importlib, inspect
for name in data['names']:
    if '.' in name:
        mod, _, attr = name.rpartition('.')
        cls = getattr(importlib.import_module(mod), attr, None)
    else:
        cls = getattr(builtins, name, None)
    if isinstance(cls, type) and issubclass(cls, BaseException):
        out['mro'][name] = [k.__name__ for k in reversed(cls.__mro__) if k is not object]
for n in dir(builtins):
    v = getattr(builtins, n)
    if isinstance(v, type) and issubclass(v, BaseException) and not n.startswith('_'):
        out['surface'].append(n)
# public surface of each documented module: __all__, else public non-module names
out['modules'] = {}
for m, classes in data['modules'].items():
    mod = importlib.import_module(m)
    names = getattr(mod, '__all__', None)
    if names is None:
        names = [n for n in dir(mod) if not n.startswith('_') and not inspect.ismodule(getattr(mod, n))]
    names = list(names)
    # the hub's coverClasses: every public name a class defines ITSELF
    # (vars(cls), not inherited) counts as 'Class.name'
    for c in classes:
        cls = mod
        for part in c.split('.'):
            cls = getattr(cls, part)
        names += [f'{c}.{n}' for n in vars(cls) if not n.startswith('_')]
    out['modules'][m] = sorted(names)
json.dump(out, open(sys.argv[2], 'w', encoding='utf-8'))
`;
const tmp = fs.mkdtempSync(path.join(__dirname, 'audit-tmp-'));
let facts;
try {
  fs.writeFileSync(path.join(tmp, 'facts.py'), py);
  fs.writeFileSync(path.join(tmp, 'in.json'), JSON.stringify({
    compiles,
    names: pages.filter((p) => p.method.chain).map((p) => p.meta.name),
    modules: Object.fromEntries(
      [...new Set(pages.filter((p) => p.rel.startsWith('python/stdlib/')).map((p) => p.rel.split('/')[2]))].map((m) => {
        const hub = pages.find((p) => p.rel === `python/stdlib/${m}` && p.slug === 'index');
        return [m, (hub && hub.method.coverClasses) || []];
      }),
    ),
  }));
  execFileSync('python', [path.join(tmp, 'facts.py'), path.join(tmp, 'in.json'), path.join(tmp, 'out.json')], { stdio: 'inherit' });
  facts = JSON.parse(fs.readFileSync(path.join(tmp, 'out.json'), 'utf8'));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

for (const c of compiles) {
  const err = facts.compile[c.id];
  if (err) fails.PATTERN.push(`${c.id}: ${err}`);
  else pass += 1;
}

for (const p of pages) {
  if (!p.method.chain) continue;
  const real = facts.mro[p.meta.name];
  if (!real) fails.CHAIN.push(`${p.rel}/${p.slug}: '${p.meta.name}' is not a built-in exception class`);
  else if (JSON.stringify(real) !== JSON.stringify(p.method.chain)) {
    fails.CHAIN.push(`${p.rel}/${p.slug}: chain ${JSON.stringify(p.method.chain)} != real ${JSON.stringify(real)}`);
  } else pass += 1;
}

// Coverage — python/exceptions only
const excPages = pages.filter((p) => p.rel === 'python/exceptions');
let covered = 0;
if (excPages.length > 0) {
  const byName = new Set(excPages.map((p) => p.meta.name));
  const terms = new Set(excPages.flatMap((p) => String(p.meta.searchTerms || '').toLowerCase().split(/\s+/)));
  for (const name of facts.surface) {
    if (byName.has(name) || terms.has(name.toLowerCase())) covered += 1;
    else fails.COVERAGE.push(`builtins.${name} has no page and is not in any exceptions page's searchTerms`);
  }
}

// Coverage — python/keywords
const kwPages = pages.filter((p) => p.rel === 'python/keywords');
let kwCovered = 0;
if (kwPages.length > 0) {
  const AS_OPERATORS = ['and', 'or', 'not', 'in', 'is'];
  const claimedBy = new Map();
  for (const p of kwPages) {
    const terms = new Set(String(p.meta.searchTerms || '').toLowerCase().split(/\s+/));
    for (const k of p.method.covers || []) {
      if (claimedBy.has(k)) fails.KWCOVERAGE.push(`'${k}' claimed by both ${claimedBy.get(k)} and ${p.slug}`);
      claimedBy.set(k, p.slug);
      if (!terms.has(k.toLowerCase())) fails.KWCOVERAGE.push(`${p.slug}: covers '${k}' but it is not in its searchTerms`);
    }
  }
  for (const k of facts.keywords) {
    if (claimedBy.has(k)) { kwCovered += 1; continue; }
    if (AS_OPERATORS.includes(k) && fs.existsSync(path.join(CONTENT, 'python', 'operators', `${k}.js`))) { kwCovered += 1; continue; }
    fails.KWCOVERAGE.push(`keyword '${k}' is not in any keyword page's method.covers`);
  }
  for (const k of claimedBy.keys()) {
    if (!facts.keywords.includes(k)) fails.KWCOVERAGE.push(`'${k}' in method.covers of ${claimedBy.get(k)} is not a Python keyword`);
  }
}

// Coverage — stdlib modules: every public name (module.__all__, else the
// public non-module names), plus 'Class.name' for every public name the
// hub's coverClasses define themselves, claimed by exactly one member
// page's covers.
const modSummary = [];
for (const [m, surface] of Object.entries(facts.modules || {})) {
  const members = pages.filter((p) => p.rel === `python/stdlib/${m}` && p.slug !== 'index');
  const claimed = new Map();
  for (const p of members) {
    for (const n of p.method.covers || []) {
      if (claimed.has(n)) fails.MODCOVERAGE.push(`${m}.${n} claimed by both ${claimed.get(n)} and ${p.slug}`);
      claimed.set(n, p.slug);
      if (!surface.includes(n)) fails.MODCOVERAGE.push(`${m}/${p.slug}: covers '${n}', which is not public API of ${m}`);
    }
  }
  const missing = surface.filter((n) => !claimed.has(n));
  missing.forEach((n) => fails.MODCOVERAGE.push(`${m}.${n} has no member page (no covers entry)`));
  modSummary.push(`${m} ${surface.length - missing.length}/${surface.length}`);
  if (!pages.some((p) => p.rel === `python/stdlib/${m}` && p.slug === 'index')) {
    fails.MODCOVERAGE.push(`${m}: no index.js module hub`);
  }
}

// ── Report ───────────────────────────────────────────────────
const total = Object.values(fails).reduce((n, l) => n + l.length, 0);
console.log(`\n=== Snippet audit: ${pages.length} page(s) in ${VERIFIED.join(', ')} ===`);
console.log(`snippets run: ${runs.length}   patterns compiled: ${compiles.length}   passed checks: ${pass}`);
if (excPages.length > 0) console.log(`exception coverage: ${covered}/${facts.surface.length} built-in classes`);
if (kwPages.length > 0) console.log(`keyword coverage: ${kwCovered}/${facts.keywords.length} keywords + soft keywords`);
if (modSummary.length > 0) console.log(`module coverage: ${modSummary.join(', ')}`);
for (const [k, list] of Object.entries(fails)) console.log(`${k}: ${list.length}`);
for (const [k, list] of Object.entries(fails)) {
  if (list.length === 0) continue;
  const shown = VERBOSE || !k.includes('COVERAGE') ? list : list.slice(0, 10);
  console.log(`\n--- ${k} (${list.length}) ---`);
  shown.forEach((l) => console.log('  ' + l));
  if (shown.length < list.length) console.log(`  … ${list.length - shown.length} more (--verbose)`);
}
process.exitCode = total > 0 ? 1 : 0;
