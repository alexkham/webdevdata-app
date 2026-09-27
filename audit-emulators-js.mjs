// audit-emulators-js.mjs
//
// QA tool — NOT part of the build. The JavaScript counterpart of
// audit-emulators.mjs.
//
// For Python the differential is JS-emulator vs real CPython, because the
// emulator is a reimplementation that can drift from the language. For
// JavaScript there is nothing to reimplement — the demo runs in a JS engine
// already. What CAN drift is the pairing: the expression shown to the user
// (built from demoTemplate) and the emulator that produces the output next
// to it. This tool evaluates the SHOWN expression in Node and compares it
// against the emulator's result, so the two can never disagree silently.
//
//   VALUE   — expression and emulator produced different results
//   ERRTYPE — one threw and the other did not, or different error names
//   ERROR   — same error name, different message (cosmetic)
//
// Usage: node audit-emulators-js.mjs [--verbose]

import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { jsRepr } from './utils/js-repr.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, 'content', 'reference', 'javascript');
const EMU_DIR = path.join(__dirname, 'utils', 'emulators', 'javascript');
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

// ── Build the expression exactly as MethodDemo displays it ───
function buildExpression(method, demoParams, args) {
  const reprOf = (v) => (typeof v === 'number' ? String(v) : jsRepr(v));

  let callText;
  if (method.demoTemplate) {
    callText = method.demoTemplate.replace(/\{(\w+)\}/g, (_, name) => {
      const i = demoParams.findIndex((p) => p.name === name);
      return i === -1 ? `{${name}}` : reprOf(args[i]);
    });
  } else if (method.name.includes('.')) {
    const methodName = method.name.split('.').pop();
    callText = `${jsRepr(args[0])}.${methodName}(${args.slice(1).map(reprOf).join(', ')})`;
  } else {
    callText = `${method.name}(${args.map(reprOf).join(', ')})`;
  }
  if (method.demoWrap) callText = `${method.demoWrap}(${callText})`;
  if (method.demoAsync) callText = `await ${callText}`; // mirrors MethodDemo
  return callText;
}

// ── Collect all cases ────────────────────────────────────────
const checks = []; // { id, category, slug, expr, args }
if (!fs.existsSync(CONTENT_DIR)) {
  console.log('\n=== Differential emulator audit (JavaScript) ===');
  console.log('no javascript content yet — nothing to check');
  process.exit(0);
}

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
        expr: buildExpression(method, demoParams, args),
        args,
        isAsync: Boolean(method.demoAsync),
      });
    }
  }
}

// ── Evaluate the shown expression, and the emulator ──────────
const emuCache = new Map();
async function getEmu(category, slug) {
  const key = `${category}/${slug}`;
  if (!emuCache.has(key)) {
    const mod = await import(pathToFileURL(path.join(EMU_DIR, category, `${slug}.js`)).href);
    emuCache.set(key, mod.default);
  }
  return emuCache.get(key);
}

// Awaiting is harmless for synchronous results (they pass straight through),
// so one runner serves both paths — but a sync demo that accidentally returns
// a promise would be masked, so async-ness must match the content flag.
const run = async (fn) => {
  try {
    return { ok: true, text: jsRepr(await fn()) };
  } catch (e) {
    return { ok: false, text: `${e.name || 'Error'}: ${e.message}`, name: e.name || 'Error' };
  }
};
const isThenable = (v) => v !== null && typeof v === 'object' && typeof v.then === 'function';

const buckets = { VALUE: [], ERRTYPE: [], ERROR: [], ASYNCFLAG: [] };
let pass = 0;

for (const chk of checks) {
  const emuFn = await getEmu(chk.category, chk.slug);

  // The async flag must be truthful in both directions: a demoAsync page whose
  // emulator returns a plain value, or a sync page whose emulator returns a
  // promise (which the page would render as '{}'), are both bugs.
  let probe;
  try { probe = emuFn(...chk.args); } catch { probe = undefined; }
  if (isThenable(probe) !== chk.isAsync) {
    if (isThenable(probe)) probe.catch(() => {}); // avoid an unhandled rejection
    buckets.ASYNCFLAG.push({ id: chk.id, expr: chk.expr, shown: `demoAsync=${chk.isAsync}`, emulator: `returns ${isThenable(probe) ? 'a promise' : 'a plain value'}` });
    continue;
  }
  if (isThenable(probe)) probe.catch(() => {});

  // Async expressions contain `await`, so they are evaluated inside an async
  // arrow; sync expressions are evaluated exactly as before.
  const source = chk.isAsync ? `(async () => (${chk.expr}))()` : chk.expr;
  // eslint-disable-next-line no-eval
  const shown = await run(() => (0, eval)(source));
  const emu = await run(() => emuFn(...chk.args));

  if (shown.text === emu.text) { pass += 1; continue; }

  const record = { id: chk.id, expr: chk.expr, shown: shown.text, emulator: emu.text };
  if (!shown.ok && !emu.ok) {
    if (shown.name === emu.name) buckets.ERROR.push(record);
    else buckets.ERRTYPE.push(record);
  } else if (!shown.ok || !emu.ok) {
    buckets.ERRTYPE.push(record);
  } else {
    buckets.VALUE.push(record);
  }
}

// ── Report ───────────────────────────────────────────────────
console.log('\n=== Differential emulator audit (shown expression vs emulator) ===');
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
    console.log(`    shown:    ${r.shown}`);
    console.log(`    emulator: ${r.emulator}`);
  }
};
printBucket('VALUE', buckets.VALUE);
printBucket('ERRTYPE', buckets.ERRTYPE);
if (VERBOSE) printBucket('ERROR', buckets.ERROR);

process.exitCode = buckets.VALUE.length + buckets.ERRTYPE.length > 0 ? 1 : 0;
