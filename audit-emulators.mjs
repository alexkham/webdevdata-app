// audit-emulators.mjs
//
// QA tool — NOT part of the build. Differentially tests every live-demo
// emulator against real CPython:
//
//   1. Loads each content file's demo cases (the seed inputs users see).
//   2. Coerces values exactly like MethodDemo does.
//   3. Builds the equivalent Python expression (same call-shape rules as
//      the demo's call preview, including trailing-default omission).
//   4. Runs all expressions through real Python in one batch, capturing
//      repr(result) or "ExceptionName: message".
//   5. Runs the same args through the JS emulator + pyRepr.
//   6. Reports every divergence, bucketed:
//        VALUE     — different results (real bug candidates)
//        ERROR     — same exception type, different message (cosmetic)
//        ERRTYPE   — different/missing exception (real bug candidates)
//        FLOATREPR — same number, int-vs-float display (4 vs 4.0)
//        QUOTESTYLE— same string, quote-style repr difference
//
// Usage: node audit-emulators.mjs [--verbose]

import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { pyRepr } from './utils/code-highlight.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, 'content', 'reference', 'python');
const EMU_DIR = path.join(__dirname, 'utils', 'emulators', 'python');
const TMP_DIR = path.join(__dirname, 'audit-tmp');
const VERBOSE = process.argv.includes('--verbose');

// ── Mirror of MethodDemo.coerce ──────────────────────────────
function coerce(raw, param) {
  const s = String(raw);
  switch (param.input) {
    case 'number': {
      const n = parseInt(s, 10);
      return Number.isNaN(n) ? -1 : n;
    }
    case 'number-or-none': {
      const n = parseInt(s, 10);
      return Number.isNaN(n) ? null : n;
    }
    case 'float': {
      const f = parseFloat(s);
      return Number.isNaN(f) ? 0 : f;
    }
    case 'text-or-none':
      return s === '' ? null : s;
    case 'csv':
      return s.trim() === '' ? [] : s.split(',').map((x) => x.trim());
    case 'csv-num':
      return s.trim() === ''
        ? []
        : s.split(',').map((x) => {
            const f = parseFloat(x.trim());
            return Number.isNaN(f) ? 0 : f;
          });
    case 'csv-set':
      return {
        __pySet: s.trim() === '' ? [] : [...new Set(s.split(',').map((x) => x.trim()))],
      };
    case 'auto': {
      const t = s.trim();
      if (/^[+-]?\d+$/.test(t)) return parseInt(t, 10);
      if (/^[+-]?(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?$/.test(t) && /[.eE]/.test(t)) return parseFloat(t);
      return s;
    }
    case 'kv': {
      const obj = {};
      if (s.trim() === '') return obj;
      s.split(',').forEach((pair) => {
        const idx = pair.indexOf(':');
        if (idx === -1) return;
        obj[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
      });
      return obj;
    }
    default:
      return s;
  }
}

// ── JS value → Python literal ────────────────────────────────
function pyLit(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') {
    return "'" + v
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t') + "'";
  }
  if (Array.isArray(v)) return '[' + v.map(pyLit).join(', ') + ']';
  if (typeof v === 'object') {
    if (v.__pySet !== undefined) {
      return v.__pySet.length === 0 ? 'set()' : '{' + v.__pySet.map(pyLit).join(', ') + '}';
    }
    if (v.__pyTuple !== undefined) {
      const items = v.__pyTuple.map(pyLit);
      return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
    }
    return '{' + Object.entries(v).map(([k, val]) => `${pyLit(k)}: ${pyLit(val)}`).join(', ') + '}';
  }
  return String(v);
}

// ── Build the Python expression for one case ─────────────────
// Mirrors MethodDemo's call-preview rules, including omission of trailing
// args that are null or equal the declared parameter default.
function buildExpression(method, demoParams, args) {
  const wrap = (expr) => (method.demoWrap ? `${method.demoWrap}(${expr})` : expr);
  if (method.demoTemplate) {
    return wrap(method.demoTemplate.replace(/\{(\w+)\}/g, (_, name) => {
      const i = demoParams.findIndex((p) => p.name === name);
      return i === -1 ? `{${name}}` : pyLit(args[i]);
    }));
  }

  const byName = new Map((method.parameters || []).map((p) => [p.name, p]));
  const isDefault = (paramName, value) => {
    const decl = byName.get(paramName);
    if (!decl || decl.required) return false;
    if (value === null) return true;
    return String(value) === String(decl.default);
  };

  if (method.name.includes('.')) {
    const methodName = method.name.split('.').pop();
    const rest = demoParams.slice(1).map((p, i) => ({ lit: pyLit(args[i + 1]), def: isDefault(p.name, args[i + 1]) }));
    let last = rest.length - 1;
    while (last >= 0 && rest[last].def) last -= 1;
    return wrap(`${pyLit(args[0])}.${methodName}(${rest.slice(0, last + 1).map((r) => r.lit).join(', ')})`);
  }

  const parts = demoParams.map((p, i) => ({ lit: pyLit(args[i]), def: i > 0 && isDefault(p.name, args[i]) }));
  let last = parts.length - 1;
  while (last >= 1 && parts[last].def) last -= 1;
  return wrap(`${method.name}(${parts.slice(0, last + 1).map((r) => r.lit).join(', ')})`);
}

// ── Collect all cases ────────────────────────────────────────
const checks = []; // { id, category, slug, caseId, expr, args }
for (const category of fs.readdirSync(CONTENT_DIR)) {
  const dir = path.join(CONTENT_DIR, category);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
    const slug = f.replace(/\.js$/, '');
    const mod = await import(pathToFileURL(path.join(dir, f)).href);
    const { meta, method } = mod;
    if (!meta || !meta.hasLiveDemo) continue;
    const demoParams = method.demoParams || [];
    const cases = method.cases || [];
    if (demoParams.length === 0 || cases.length === 0) {
      console.warn(`[warn] ${category}/${slug}: hasLiveDemo but no demoParams/cases`);
      continue;
    }
    for (const c of cases) {
      const args = demoParams.map((p) => coerce(c.values[p.name] !== undefined ? c.values[p.name] : '', p));
      checks.push({
        id: `${category}/${slug}#${c.id}`,
        category,
        slug,
        caseId: c.id,
        expr: buildExpression(method, demoParams, args),
        args,
      });
    }
  }
}

// ── Run all expressions through real Python, one batch ───────
fs.mkdirSync(TMP_DIR, { recursive: true });
fs.writeFileSync(
  path.join(TMP_DIR, 'cases.json'),
  JSON.stringify(checks.map(({ id, expr }) => ({ id, expr })), null, 0)
);
fs.writeFileSync(
  path.join(TMP_DIR, 'run.py'),
  `import json, sys
with open(${JSON.stringify(path.join(TMP_DIR, 'cases.json'))}, encoding='utf-8') as f:
    _cases = json.load(f)
_out = []
for _c in _cases:
    try:
        # isolated namespace per expression — content demos include exec()
        # and compile(), which would otherwise pollute OUR variables
        _r = repr(eval(_c["expr"], {}))
    except Exception as _e:
        _r = type(_e).__name__ + ": " + str(_e)
    _out.append({"id": _c["id"], "r": _r})
with open(${JSON.stringify(path.join(TMP_DIR, 'results.json'))}, "w", encoding='utf-8') as f:
    json.dump(_out, f)
`
);
execFileSync('python', [path.join(TMP_DIR, 'run.py')], { stdio: 'inherit' });
const pyResults = new Map(
  JSON.parse(fs.readFileSync(path.join(TMP_DIR, 'results.json'), 'utf8')).map((r) => [r.id, r.r])
);

// ── Run the emulators ────────────────────────────────────────
const emuCache = new Map();
async function getEmu(category, slug) {
  const key = `${category}/${slug}`;
  if (!emuCache.has(key)) {
    const mod = await import(pathToFileURL(path.join(EMU_DIR, category, `${slug}.js`)).href);
    emuCache.set(key, mod.default);
  }
  return emuCache.get(key);
}

function emuResult(fn, args) {
  try {
    return pyRepr(fn(...args));
  } catch (e) {
    return `${e.name || 'Error'}: ${e.message}`;
  }
}

// ── Compare and bucket ───────────────────────────────────────
const ERR_RE = /^([A-Za-z]+Error|StopIteration|KeyboardInterrupt): ([\s\S]*)$/;
const buckets = { VALUE: [], ERRTYPE: [], ERROR: [], FLOATREPR: [], QUOTESTYLE: [] };
let pass = 0;

// Python set repr order is hash-random — compare set-shaped reprs as
// sorted element multisets instead of strings.
const setElements = (s) => {
  let body = null;
  if (/^\{[^:]*\}$/.test(s) && !s.includes(': ')) body = s.slice(1, -1);
  else if (/^frozenset\(\{.*\}\)$/.test(s)) body = s.slice(11, -2);
  else if (s === 'set()' || s === 'frozenset()') body = '';
  if (body === null) return null;
  if (body.trim() === '') return [];
  return body.split(', ').map((x) => x.trim()).sort();
};

const stripQuotes = (s) => {
  // normalize outer quote style of a repr'd string
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
  }
  return null;
};

for (const chk of checks) {
  const py = pyResults.get(chk.id);
  const emuFn = await getEmu(chk.category, chk.slug);
  const emu = emuResult(emuFn, chk.args);

  if (py === emu) { pass += 1; continue; }

  // set-shaped results: order-insensitive equality
  const pySet = setElements(py);
  const emuSet = setElements(emu);
  if (pySet !== null && emuSet !== null && JSON.stringify(pySet) === JSON.stringify(emuSet)) {
    pass += 1;
    continue;
  }

  const pyErr = py.match(ERR_RE);
  const emuErr = emu.match(ERR_RE);
  const record = { id: chk.id, expr: chk.expr, python: py, emulator: emu };

  if (pyErr && emuErr) {
    if (pyErr[1] === emuErr[1]) buckets.ERROR.push(record);
    else buckets.ERRTYPE.push(record);
    continue;
  }
  if (pyErr || emuErr) { buckets.ERRTYPE.push(record); continue; }

  // int-vs-float display of the same number: 4 vs 4.0
  if (py === `${emu}.0` || emu === `${py}.0` || (py.endsWith('.0') && py.slice(0, -2) === emu)) {
    buckets.FLOATREPR.push(record);
    continue;
  }
  // quote-style-only repr difference for strings
  const pv = stripQuotes(py);
  const ev = stripQuotes(emu);
  if (pv !== null && ev !== null && pv === ev) {
    buckets.QUOTESTYLE.push(record);
    continue;
  }
  buckets.VALUE.push(record);
}

// ── Report ───────────────────────────────────────────────────
console.log(`\n=== Differential emulator audit (Python vs emulators) ===`);
console.log(`checks: ${checks.length}   exact pass: ${pass}`);
for (const [name, list] of Object.entries(buckets)) {
  console.log(`${name}: ${list.length}`);
}
const printBucket = (name, list) => {
  if (list.length === 0) return;
  console.log(`\n--- ${name} (${list.length}) ---`);
  for (const r of list) {
    console.log(`  ${r.id}`);
    console.log(`    expr:     ${r.expr}`);
    console.log(`    python:   ${r.python}`);
    console.log(`    emulator: ${r.emulator}`);
  }
};
printBucket('VALUE', buckets.VALUE);
printBucket('ERRTYPE', buckets.ERRTYPE);
if (VERBOSE) {
  printBucket('ERROR', buckets.ERROR);
  printBucket('FLOATREPR', buckets.FLOATREPR);
  printBucket('QUOTESTYLE', buckets.QUOTESTYLE);
}

fs.rmSync(TMP_DIR, { recursive: true, force: true });
process.exitCode = buckets.VALUE.length + buckets.ERRTYPE.length > 0 ? 1 : 0;
