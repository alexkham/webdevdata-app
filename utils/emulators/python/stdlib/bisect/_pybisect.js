// utils/emulators/python/stdlib/bisect/_pybisect.js
//
// Port of CPython 3.13's Modules/_bisectmodule.c — shared by the bisect hub
// and every member emulator. Not a content page (leading underscore), so
// the catalog generator never maps it.
//
//   internal_bisect_right / internal_bisect_left — the same midpoints, the
//   same comparison direction (x < a[mid] for right, a[mid] < x for left),
//   so results, IndexErrors and TypeError messages match CPython.
//   Argument conversion: lo is a C ssize_t (OverflowError "Python int too
//   large to convert to C ssize_t"), hi goes through the optional-ssize_t
//   converter ("cannot fit 'int' into an index-sized integer"), hi == -1
//   means len(a) — exactly like the default.
//   insort_*: key(x) is computed first, then list.insert(index, x).
//
// Value model shared with the itertools/heapq ports: int → bigint, float →
// PyFloat, str → string, list → Array.

import { PyException } from '../../../../py-exceptions.js';
import { pyLt, pyNeg, pyAbs, nums, asPy, tuple, typeName, PyFloat } from '../heapq/_pyheapq.js';

export { pyLt, pyNeg, pyAbs, nums, asPy, tuple, typeName, PyFloat };

export const raise = (type, msg = '') => { throw new PyException(type, msg); };

const MAXSIZE = 9223372036854775807n;

function loArg(lo) {
  if (lo === undefined || lo === null) return 0n;
  if (typeof lo !== 'bigint') raise('TypeError', `'${typeName(lo)}' object cannot be interpreted as an integer`);
  if (lo > MAXSIZE || lo < -MAXSIZE - 1n) raise('OverflowError', 'Python int too large to convert to C ssize_t');
  return lo;
}

function hiArg(hi) {
  if (hi === undefined || hi === null) return -1n;
  if (typeof hi !== 'bigint') raise('TypeError', `'${typeName(hi)}' object cannot be interpreted as an integer`);
  if (hi > MAXSIZE || hi < -MAXSIZE - 1n) raise('OverflowError', "cannot fit 'int' into an index-sized integer");
  return hi;
}

function getItem(a, mid) {
  if (mid >= BigInt(a.length)) raise('IndexError', 'list index out of range');
  return a[Number(mid)];
}

function search(a, x, lo, hi, key, right) {
  if (lo < 0n) raise('ValueError', 'lo must be non-negative');
  if (hi === -1n) hi = BigInt(a.length);
  while (lo < hi) {
    const mid = (lo + hi) / 2n; // both non-negative here: BigInt division floors
    let litem = getItem(a, mid);
    if (key) litem = key(litem);
    if (right) {
      if (pyLt(x, litem)) hi = mid;
      else lo = mid + 1n;
    } else if (pyLt(litem, x)) lo = mid + 1n;
    else hi = mid;
  }
  return lo;
}

// bisect.bisect_right(a, x, lo=0, hi=len(a), *, key=None) — also bisect.bisect
export function bisectRight(a, x, lo, hi, key = null) {
  const l = loArg(lo);
  const h = hiArg(hi);
  return search(a, x, l, h, key, true);
}

// bisect.bisect_left(a, x, lo=0, hi=len(a), *, key=None)
export function bisectLeft(a, x, lo, hi, key = null) {
  const l = loArg(lo);
  const h = hiArg(hi);
  return search(a, x, l, h, key, false);
}

// list.insert(i, x): i is clamped to [0, len]
function listInsert(a, i, x) {
  let n = i;
  if (n < 0n) { n += BigInt(a.length); if (n < 0n) n = 0n; }
  if (n > BigInt(a.length)) n = BigInt(a.length);
  a.splice(Number(n), 0, x);
}

// bisect.insort_right / insort — key(x) is used for the search only
export function insortRight(a, x, lo, hi, key = null) {
  const l = loArg(lo);
  const h = hiArg(hi);
  const kx = key ? key(x) : x;
  listInsert(a, search(a, kx, l, h, key, true), x);
  return null;
}

// bisect.insort_left
export function insortLeft(a, x, lo, hi, key = null) {
  const l = loArg(lo);
  const h = hiArg(hi);
  const kx = key ? key(x) : x;
  listInsert(a, search(a, kx, l, h, key, false), x);
  return null;
}

// one demo number → Python value; float(x) for an int
export const num = (n) => nums([n])[0];
export const toFloat = (v) => (v instanceof PyFloat ? v : new PyFloat(Number(v)));
