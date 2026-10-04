// utils/emulators/python/stdlib/functools/_pyfunctools.js
//
// Ports of the CPython 3.13 behaviour the functools demos show — shared by
// the module hub and the member emulators. Not a content page (leading
// underscore), so the catalog generator never maps it.
//
//   reduce()               Modules/_functoolsmodule.c functools_reduce
//   LruCache               bounded / infinite / uncached lru_cache wrappers
//                          and lru_cache_make_key (the int/str key shortcut)
//   cacheInfo()            repr of the CacheInfo named tuple
//   cleanDoc()             Python/compile.c _PyCompile_CleanDoc (3.13 strips
//                          docstring indentation at compile time)
//   intRepr()              repr(int) with the 4300-digit str limit
//
// Value model shared with the itertools port: None → null, int → bigint,
// float → PyFloat, str → string, list → Array, tuple → { __pyTuple }.

import { PyException } from '../../../../py-exceptions.js';
import { PyFloat, asPy, pyValRepr } from '../json/_pyjson.js';
import { pyNum, add, sub, mul, lt, eq, typeName, tuple, iter } from '../itertools/_pyitertools.js';

export { PyFloat, asPy, pyValRepr, pyNum, add, sub, mul, lt, eq, typeName, tuple, iter };

export const raise = (type, msg = '') => { throw new PyException(type, msg); };

// ─── reduce ─────────────────────────────────────────────────

const NO_INITIAL = Symbol('no initial');
export function reduce(fn, iterable, initial = NO_INITIAL) {
  let it;
  try {
    it = iter(iterable);
  } catch (e) {
    if (e.name === 'TypeError') raise('TypeError', 'reduce() arg 2 must support iteration');
    throw e;
  }
  let result = initial === NO_INITIAL ? undefined : initial;
  for (const item of it) {
    result = result === undefined ? item : fn(result, item);
  }
  if (result === undefined) raise('TypeError', 'reduce() of empty iterable with no initial value');
  return result;
}

// ─── lru_cache ──────────────────────────────────────────────

// lru_cache_make_key for one positional argument and typed=False: an
// exact int or str is its own key; anything else is keyed by the args
// tuple — so 1 and 1.0 are DIFFERENT keys (1 != (1.0,)).
function makeKey(x) {
  if (typeof x === 'bigint') return { kind: 'scalar', v: x };
  if (typeof x === 'string') return { kind: 'scalar', v: x };
  return { kind: 'tuple', v: x };
}
function keyEq(a, b) {
  if (a.kind !== b.kind) return false;
  if (a.kind === 'scalar') return a.v === b.v;
  // tuple keys: (x,) == (y,) → x == y for the demo's numbers
  return eq(a.v, b.v);
}

// maxsize: bigint | null (None). Negative behaves as 0.
export class LruCache {
  constructor(fn, maxsize = 128n) {
    this.fn = fn;
    this.maxsize = maxsize === null ? null : maxsize < 0n ? 0n : maxsize;
    this.hits = 0n;
    this.misses = 0n;
    this.entries = []; // oldest first: [{ key, result }]
  }

  find(key) {
    return this.entries.findIndex((e) => keyEq(e.key, key));
  }

  call(x) {
    if (this.maxsize === 0n) {
      this.misses += 1n;
      return this.fn(x);
    }
    const key = makeKey(x);
    const i = this.find(key);
    if (i !== -1) {
      this.hits += 1n;
      const [link] = this.entries.splice(i, 1);
      if (this.maxsize !== null) this.entries.push(link); // most recently used
      else this.entries.splice(i, 0, link); // the unbounded cache keeps no order
      return link.result;
    }
    this.misses += 1n;
    const result = this.fn(x);
    if (this.maxsize === null) {
      const j = this.find(key);
      if (j === -1) this.entries.push({ key, result });
      else this.entries[j].result = result;
      return result;
    }
    // bounded: a recursive call may already have cached this key
    if (this.find(key) !== -1) return result;
    if (BigInt(this.entries.length) >= this.maxsize) this.entries.shift(); // evict the oldest
    this.entries.push({ key, result });
    return result;
  }

  get currsize() { return BigInt(this.entries.length); }

  info() {
    return { __pyRaw: `CacheInfo(hits=${this.hits}, misses=${this.misses}, maxsize=${this.maxsize === null ? 'None' : this.maxsize}, currsize=${this.currsize})` };
  }
}

// ─── ints ───────────────────────────────────────────────────

// repr() of an int: past 4300 decimal digits CPython refuses
export function intRepr(v) {
  const s = (v < 0n ? -v : v).toString();
  if (s.length > 4300) {
    raise('ValueError', 'Exceeds the limit (4300 digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit');
  }
  return v.toString();
}

// ─── docstrings ─────────────────────────────────────────────

// str.expandtabs(8): the column resets after \n and \r
function expandTabs(s) {
  let out = '';
  let col = 0;
  for (const ch of s) {
    if (ch === '\t') {
      const n = 8 - (col % 8);
      out += ' '.repeat(n);
      col += n;
    } else {
      out += ch;
      col = ch === '\n' || ch === '\r' ? 0 : col + 1;
    }
  }
  return out;
}

// _PyCompile_CleanDoc: expand tabs, drop the first line's leading spaces,
// remove the common indentation of the following non-blank lines.
export function cleanDoc(doc) {
  const lines = expandTabs(doc).split('\n');
  let margin = Infinity;
  for (const line of lines.slice(1)) {
    const stripped = line.replace(/^ +/, '');
    if (stripped !== '') margin = Math.min(margin, line.length - stripped.length);
  }
  if (margin === Infinity) margin = 0;
  const first = lines[0].replace(/^ +/, '');
  const rest = lines.slice(1).map((line) => {
    let k = 0;
    while (k < margin && line[k] === ' ') k++;
    return line.slice(k);
  });
  return [first, ...rest].join('\n');
}
