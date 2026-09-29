// utils/emulators/python/exceptions/importerror.js
//
// Emulator for the ImportError demo modes: `from itertools import <name>`
// run through exec() on CPython 3.13. itertools is compiled into the
// interpreter on every platform, so the message always ends in
// "(unknown location)" — no file path — and its contents are the same
// everywhere.
//
// What is modelled:
//   - the template's guard: str.isidentifier() and keyword.iskeyword()
//   - the parser's NFKC normalization of identifiers (ｐｉ → pi)
//   - `from m import __debug__` is a SyntaxError (cannot assign)
//   - IMPORT_FROM: getattr(itertools, name) — module attributes plus the
//     attributes every module object has (__class__, __dict__, …)
//   - the traceback's "Did you mean" hint: CPython's suggestion search
//     (Python/suggestions.c) over dir(itertools), underscore names hidden
//     unless the wrong name itself starts with '_'

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

// dir(itertools) on CPython 3.13 (sorted, as dir() returns it)
const DIR = [
  '__doc__', '__loader__', '__name__', '__package__', '__spec__',
  '_grouper', '_tee', '_tee_dataobject', 'accumulate', 'batched', 'chain',
  'combinations', 'combinations_with_replacement', 'compress', 'count',
  'cycle', 'dropwhile', 'filterfalse', 'groupby', 'islice', 'pairwise',
  'permutations', 'product', 'repeat', 'starmap', 'takewhile', 'tee',
  'zip_longest',
];

// attributes reachable through the module object itself (ModuleType / object)
const MODULE_ATTRS = [
  '__annotations__', '__class__', '__delattr__', '__dict__', '__dir__',
  '__eq__', '__format__', '__ge__', '__getattribute__', '__getstate__',
  '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__',
  '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__',
  '__setattr__', '__sizeof__', '__str__', '__subclasshook__',
];
const HAS = new Set([...DIR, ...MODULE_ATTRS]);

// keyword.kwlist (hard keywords only — soft keywords are valid names)
const KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
  'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
  'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
  'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
]);

const isIdentifier = (s) => /^[\p{XID_Start}_][\p{XID_Continue}]*$/u.test(s);

// ── Python/suggestions.c, on UTF-8 bytes ─────────────────────
const MOVE_COST = 2;
const CASE_COST = 1;
const MAX_STRING_SIZE = 40;
const utf8 = (s) => Array.from(new TextEncoder().encode(s));

function substitutionCost(a, b) {
  if ((a & 31) !== (b & 31)) return MOVE_COST;
  if (a === b) return 0;
  const la = a >= 65 && a <= 90 ? a + 32 : a;
  const lb = b >= 65 && b <= 90 ? b + 32 : b;
  return la === lb ? CASE_COST : MOVE_COST;
}

function levenshtein(a0, b0, maxCost) {
  let a = a0;
  let b = b0;
  while (a.length && b.length && a[0] === b[0]) { a = a.slice(1); b = b.slice(1); }
  while (a.length && b.length && a[a.length - 1] === b[b.length - 1]) { a = a.slice(0, -1); b = b.slice(0, -1); }
  if (a.length === 0 || b.length === 0) return (a.length + b.length) * MOVE_COST;
  if (a.length > MAX_STRING_SIZE || b.length > MAX_STRING_SIZE) return maxCost + 1;
  if (b.length < a.length) [a, b] = [b, a];
  if ((b.length - a.length) * MOVE_COST > maxCost) return maxCost + 1;
  const row = a.map((_, i) => (i + 1) * MOVE_COST);
  let result = 0;
  for (let bi = 0; bi < b.length; bi += 1) {
    let distance = bi * MOVE_COST;
    result = distance;
    let minimum = Infinity;
    for (let i = 0; i < a.length; i += 1) {
      const substitute = distance + substitutionCost(b[bi], a[i]);
      distance = row[i];
      const insertDelete = Math.min(result, distance) + MOVE_COST;
      result = Math.min(insertDelete, substitute);
      row[i] = result;
      if (result < minimum) minimum = result;
    }
    if (minimum > maxCost) return maxCost + 1;
  }
  return result;
}

function suggest(wrong) {
  const candidates = wrong.startsWith('_') ? DIR : DIR.filter((x) => !x.startsWith('_'));
  const w = utf8(wrong);
  let best = Infinity;
  let suggestion = null;
  for (const item of candidates) {
    if (item === wrong) continue;
    const it = utf8(item);
    let maxDistance = Math.floor((w.length + it.length + 3) * MOVE_COST / 6);
    maxDistance = Math.min(maxDistance, best - 1);
    const d = levenshtein(w, it, maxDistance);
    if (d > maxDistance) continue;
    if (suggestion === null || d < best) {
      suggestion = item;
      best = d;
    }
  }
  return suggestion;
}

// the template's guard, then exec(f'from itertools import {name}')
function importFrom(raw) {
  if (!isIdentifier(raw) || KEYWORDS.has(raw)) raise('ValueError', 'not a valid name');
  const name = raw.normalize('NFKC');
  if (name === '__debug__') raise('SyntaxError', 'cannot assign to __debug__');
  if (HAS.has(name)) return;
  let msg = `cannot import name ${pyRepr(name)} from 'itertools' (unknown location)`;
  const s = suggest(name);
  if (s) msg += `. Did you mean: '${s}'?`;
  raise('ImportError', msg);
}

export default {
  trigger: (name) => {
    importFrom(name);
    return `imported ${name}`;
  },

  handle: (name) => {
    try {
      importFrom(name);
      return 'itertools';
    } catch (e) {
      if (e.name !== 'ImportError') throw e;
      // f'fallback (no {name!r} in {e.name})' — e.name is the module
      return `fallback (no ${pyRepr(name)} in itertools)`;
    }
  },
};
