// utils/emulators/python/stdlib/heapq/_pyheapq.js
//
// Port of CPython 3.13's heapq — shared by the heapq hub and every member
// emulator. Not a content page (leading underscore), so the catalog
// generator never maps it.
//
//   heappush / heappop / heapify / heapreplace / heappushpop
//       Modules/_heapqmodule.c: siftdown, siftup (the "bubble the smaller
//       child to a leaf, then sift back up" variant), heapify_internal
//       including cache_friendly_heapify for n > 2500, and the max-heap
//       twins (siftdown_max / siftup_max) that merge(reverse=True) and
//       nsmallest() use.
//   merge / nlargest / nsmallest
//       Lib/heapq.py, line for line (decorated tuples, order counters,
//       the n == 1 min()/max() and n >= len sorted() shortcuts).
//
// Because the algorithms are the same, the INTERNAL list order after every
// operation is the same as CPython's — the demos show the heap list.
//
// Value model shared with the itertools port: int → bigint, float →
// PyFloat, str → string, list → Array, tuple → { __pyTuple }.

import { PyException } from '../../../../py-exceptions.js';
import { PyFloat, asPy, pyValRepr } from '../json/_pyjson.js';
import { pyNum, lt as scalarLt, eq as scalarEq, typeName, tuple, isTuple } from '../itertools/_pyitertools.js';

export { PyFloat, asPy, pyValRepr, pyNum, tuple, typeName };

export const raise = (type, msg = '') => { throw new PyException(type, msg); };

const isNum = (v) => typeof v === 'boolean' || typeof v === 'bigint' || v instanceof PyFloat;
const seqOf = (v) => (Array.isArray(v) ? v : isTuple(v) ? v.__pyTuple : null);

// ─── comparisons (PyObject_RichCompareBool) ─────────────────

// a == b, with the identity shortcut RichCompareBool applies for ==
export function pyEq(a, b) {
  if (a === b) return true;
  if (isNum(a) && isNum(b)) return scalarEq(a, b);
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  const x = seqOf(a);
  const y = seqOf(b);
  if (x && y && Array.isArray(a) === Array.isArray(b)) {
    if (x.length !== y.length) return false;
    for (let i = 0; i < x.length; i++) if (!pyEq(x[i], y[i])) return false;
    return true;
  }
  return false;
}

function cmpError(op, a, b) {
  raise('TypeError', `'${op}' not supported between instances of '${typeName(a)}' and '${typeName(b)}'`);
}

// a < b — numbers, str, and lexicographic list/tuple comparison (the first
// unequal pair decides, then the lengths), like list_richcompare
export function pyLt(a, b) {
  if ((isNum(a) && isNum(b)) || (typeof a === 'string' && typeof b === 'string')) return scalarLt(a, b);
  const x = seqOf(a);
  const y = seqOf(b);
  if (x && y && Array.isArray(a) === Array.isArray(b)) {
    const n = Math.min(x.length, y.length);
    for (let i = 0; i < n; i++) {
      if (!pyEq(x[i], y[i])) return pyLt(x[i], y[i]);
    }
    return x.length < y.length;
  }
  return cmpError('<', a, b);
}

// a > b (max() uses Py_GT): the reflected < for the types we model
export function pyGt(a, b) {
  if ((isNum(a) && isNum(b)) || (typeof a === 'string' && typeof b === 'string')) return scalarLt(b, a);
  const x = seqOf(a);
  const y = seqOf(b);
  if (x && y && Array.isArray(a) === Array.isArray(b)) return pyLt(b, a);
  return cmpError('>', a, b);
}

// ─── C core: Modules/_heapqmodule.c ─────────────────────────

const needList = (fn, heap, argPos = '') => {
  if (!Array.isArray(heap)) {
    raise('TypeError', `${fn}() argument${argPos} must be list, not ${typeName(heap)}`);
  }
};

function siftdown(heap, startpos, pos, less) {
  if (pos >= heap.length) raise('IndexError', 'index out of range');
  while (pos > startpos) {
    const parentpos = (pos - 1) >> 1;
    if (!less(heap[pos], heap[parentpos])) break;
    const parent = heap[parentpos];
    heap[parentpos] = heap[pos];
    heap[pos] = parent;
    pos = parentpos;
  }
}

function siftup(heap, pos, less) {
  const endpos = heap.length;
  const startpos = pos;
  if (pos >= endpos) raise('IndexError', 'index out of range');
  const limit = endpos >> 1;
  while (pos < limit) {
    let childpos = 2 * pos + 1;
    if (childpos + 1 < endpos) {
      // min-heap: arr[child] < arr[child+1] ? stay : take the right child
      if (!less(heap[childpos], heap[childpos + 1])) childpos += 1;
    }
    const tmp = heap[childpos];
    heap[childpos] = heap[pos];
    heap[pos] = tmp;
    pos = childpos;
  }
  siftdown(heap, startpos, pos, less);
}

// min-heap: newitem < parent · max-heap: parent < newitem (and the child
// test arr[child+1] < arr[child]) — expressed as one "comes first" relation
const MIN = (a, b) => pyLt(a, b);
const MAX = (a, b) => pyLt(b, a);

function keepTopBit(n) {
  let i = 0;
  while (n > 1) { n >>= 1; i += 1; }
  return n << i;
}

function heapifyInternal(heap, less) {
  const n = heap.length;
  if (n > 2500) {
    const m = n >> 1;
    const leftmost = keepTopBit(m + 1) - 1;
    const mhalf = m >> 1;
    for (let i = leftmost - 1; i >= mhalf; i--) {
      let j = i;
      for (;;) { siftup(heap, j, less); if (!(j & 1)) break; j >>= 1; }
    }
    for (let i = m - 1; i >= leftmost; i--) {
      let j = i;
      for (;;) { siftup(heap, j, less); if (!(j & 1)) break; j >>= 1; }
    }
    return null;
  }
  for (let i = (n >> 1) - 1; i >= 0; i--) siftup(heap, i, less);
  return null;
}

function popInternal(heap, less) {
  if (heap.length === 0) raise('IndexError', 'index out of range');
  const lastelt = heap.pop();
  if (heap.length === 0) return lastelt;
  const returnitem = heap[0];
  heap[0] = lastelt;
  siftup(heap, 0, less);
  return returnitem;
}

function replaceInternal(heap, item, less) {
  if (heap.length === 0) raise('IndexError', 'index out of range');
  const returnitem = heap[0];
  heap[0] = item;
  siftup(heap, 0, less);
  return returnitem;
}

export function heappush(heap, item) {
  needList('heappush', heap, ' 1');
  heap.push(item);
  siftdown(heap, 0, heap.length - 1, MIN);
  return null;
}

export function heappop(heap) {
  needList('heappop', heap);
  return popInternal(heap, MIN);
}

export function heapify(heap) {
  needList('heapify', heap);
  return heapifyInternal(heap, MIN);
}

export function heapreplace(heap, item) {
  needList('heapreplace', heap, ' 1');
  return replaceInternal(heap, item, MIN);
}

export function heappushpop(heap, item) {
  needList('heappushpop', heap, ' 1');
  if (heap.length === 0) return item;
  if (!pyLt(heap[0], item)) return item;
  const returnitem = heap[0];
  heap[0] = item;
  siftup(heap, 0, MIN);
  return returnitem;
}

// private max-heap helpers (_heapify_max, _heappop_max, _heapreplace_max)
const heapifyMax = (heap) => heapifyInternal(heap, MAX);
const heappopMax = (heap) => popInternal(heap, MAX);
const heapreplaceMax = (heap, item) => replaceInternal(heap, item, MAX);

// ─── builtins the Python-level code relies on ───────────────

// CPython 3.13 Objects/listobject.c list.sort for n < 64: one count_run,
// then binary insertion — the same comparisons in the same order, so even
// a TypeError for mixed types names the operands like CPython does (same
// algorithm as the json port's sort_keys sort). Longer lists use a stable
// merge sort: same result, comparison order may differ.
function listSort(a, lt) {
  const n0 = a.length;
  if (n0 < 2) return a;
  if (n0 >= 64) {
    const idx = a.map((x, i) => [x, i]);
    idx.sort((x, y) => (lt(x[0], y[0]) ? -1 : lt(y[0], x[0]) ? 1 : x[1] - y[1]));
    idx.forEach(([x], i) => { a[i] = x; });
    return a;
  }
  const rev = (lo, hi) => {
    for (let i = lo, j = hi - 1; i < j; i++, j--) [a[i], a[j]] = [a[j], a[i]];
  };
  let n = 1;
  for (; n < n0; n++) if (lt(a[n], a[n - 1])) break;
  if (n < n0) {
    let done = false;
    if (n > 1) {
      if (lt(a[0], a[n - 1])) done = true;
      else rev(0, n);
    }
    if (!done) {
      n += 1;
      let neq = 0;
      const reverseLastNeq = () => {
        if (neq) { neq += 1; rev(n - neq, n); neq = 0; }
      };
      for (; n < n0; n++) {
        if (lt(a[n], a[n - 1])) reverseLastNeq();
        else if (lt(a[n - 1], a[n])) break;
        else neq += 1;
      }
      reverseLastNeq();
      rev(0, n);
      for (; n < n0; n++) if (lt(a[n], a[n - 1])) break;
    }
  }
  for (let ok = n; ok < n0; ok++) {
    const pivot = a[ok];
    let L = 0;
    let R = ok;
    do {
      const M = (L + R) >> 1;
      if (lt(pivot, a[M])) R = M;
      else L = M + 1;
    } while (L < R);
    for (let M = ok; M > L; M--) a[M] = a[M - 1];
    a[L] = pivot;
  }
  return a;
}

// sorted(iterable, key=key, reverse=reverse) the way list.sort does it:
// keys computed first, reverse=True reverses before and after a normal
// stable sort (so equal items keep their original order)
export function sorted(items, key = null, reverse = false) {
  const pairs = items.map((v) => ({ k: key ? key(v) : v, v }));
  if (reverse) pairs.reverse();
  listSort(pairs, (x, y) => pyLt(x.k, y.k));
  if (reverse) pairs.reverse();
  return pairs.map((p) => p.v);
}

// min()/max() with key: the first extreme item wins ties
function extreme(items, key, isMax) {
  let best;
  let bestKey;
  let first = true;
  for (const v of items) {
    const k = key ? key(v) : v;
    if (first) { best = v; bestKey = k; first = false; continue; }
    if (isMax ? pyGt(k, bestKey) : pyLt(k, bestKey)) { best = v; bestKey = k; }
  }
  return first ? [] : [best];
}

// n must be an int (the demos type it); bool/float would follow Python
const toN = (n) => (typeof n === 'bigint' ? n : BigInt(n));

// ─── Lib/heapq.py: nsmallest / nlargest ─────────────────────

export function nsmallest(nIn, iterable, key = null) {
  const n = toN(nIn);
  const items = [...iterable];
  if (n === 1n) return extreme(items, key, false);
  if (n >= BigInt(items.length)) return sorted(items, key).slice(0, Number(n));
  const take = n > 0n ? Number(n) : 0;
  if (key === null) {
    const result = items.slice(0, take).map((elem, i) => tuple(elem, BigInt(i)));
    if (result.length === 0) return [];
    heapifyMax(result);
    let top = result[0].__pyTuple[0];
    let order = n;
    for (const elem of items.slice(take)) {
      if (pyLt(elem, top)) {
        heapreplaceMax(result, tuple(elem, order));
        top = result[0].__pyTuple[0];
        order += 1n;
      }
    }
    return sorted(result).map((t) => t.__pyTuple[0]);
  }
  const result = items.slice(0, take).map((elem, i) => tuple(key(elem), BigInt(i), elem));
  if (result.length === 0) return [];
  heapifyMax(result);
  let top = result[0].__pyTuple[0];
  let order = n;
  for (const elem of items.slice(take)) {
    const k = key(elem);
    if (pyLt(k, top)) {
      heapreplaceMax(result, tuple(k, order, elem));
      top = result[0].__pyTuple[0];
      order += 1n;
    }
  }
  return sorted(result).map((t) => t.__pyTuple[2]);
}

export function nlargest(nIn, iterable, key = null) {
  const n = toN(nIn);
  const items = [...iterable];
  if (n === 1n) return extreme(items, key, true);
  if (n >= BigInt(items.length)) return sorted(items, key, true).slice(0, Number(n));
  const take = n > 0n ? Number(n) : 0;
  if (key === null) {
    const result = items.slice(0, take).map((elem, i) => tuple(elem, BigInt(-i)));
    if (result.length === 0) return [];
    heapify(result);
    let top = result[0].__pyTuple[0];
    let order = -n;
    for (const elem of items.slice(take)) {
      if (pyLt(top, elem)) {
        heapreplace(result, tuple(elem, order));
        top = result[0].__pyTuple[0];
        order -= 1n;
      }
    }
    return sorted(result, null, true).map((t) => t.__pyTuple[0]);
  }
  const result = items.slice(0, take).map((elem, i) => tuple(key(elem), BigInt(-i), elem));
  if (result.length === 0) return [];
  heapify(result);
  let top = result[0].__pyTuple[0];
  let order = -n;
  for (const elem of items.slice(take)) {
    const k = key(elem);
    if (pyLt(top, k)) {
      heapreplace(result, tuple(k, order, elem));
      top = result[0].__pyTuple[0];
      order -= 1n;
    }
  }
  return sorted(result, null, true).map((t) => t.__pyTuple[2]);
}

// ─── Lib/heapq.py: merge ────────────────────────────────────

// merge(*iterables, key=None, reverse=False) — a generator, like CPython;
// heap entries are lists [value, order, next] / [key, order, value, next]
// (orders are unique, so the comparison never reaches `next`)
export function* merge(iterables, key = null, reverse = false) {
  const h = [];
  const hify = reverse ? heapifyMax : heapify;
  const hpop = reverse ? heappopMax : heappop;
  const hreplace = reverse ? heapreplaceMax : heapreplace;
  const direction = reverse ? -1n : 1n;
  const DONE = Symbol('StopIteration');
  const nextOf = (it) => () => { const r = it.next(); return r.done ? DONE : r.value; };

  if (key === null) {
    iterables.forEach((src, order) => {
      const next = nextOf(src[Symbol.iterator]());
      const v = next();
      if (v !== DONE) h.push([v, BigInt(order) * direction, next]);
    });
    hify(h);
    while (h.length > 1) {
      for (;;) {
        const s = h[0];
        yield s[0];
        const v = s[2]();
        if (v === DONE) { hpop(h); break; }
        s[0] = v;
        hreplace(h, s);
      }
    }
    if (h.length) {
      const [value, , next] = h[0];
      yield value;
      for (let v = next(); v !== DONE; v = next()) yield v;
    }
    return;
  }

  iterables.forEach((src, order) => {
    const next = nextOf(src[Symbol.iterator]());
    const v = next();
    if (v !== DONE) h.push([key(v), BigInt(order) * direction, v, next]);
  });
  hify(h);
  while (h.length > 1) {
    for (;;) {
      const s = h[0];
      yield s[2];
      const v = s[3]();
      if (v === DONE) { hpop(h); break; }
      s[0] = key(v);
      s[2] = v;
      hreplace(h, s);
    }
  }
  if (h.length) {
    const [, , value, next] = h[0];
    yield value;
    for (let v = next(); v !== DONE; v = next()) yield v;
  }
}

// ─── demo helpers ───────────────────────────────────────────

// typed numbers (csv-num / number inputs) → Python values
export const nums = (xs) => xs.map(pyNum);

// abs() and unary minus for the key= demos
export function pyAbs(v) {
  if (v instanceof PyFloat) return new PyFloat(Math.abs(v.v));
  if (typeof v === 'bigint') return v < 0n ? -v : v;
  return raise('TypeError', `bad operand type for abs(): '${typeName(v)}'`);
}
export function pyNeg(v) {
  if (v instanceof PyFloat) return new PyFloat(-v.v);
  if (typeof v === 'bigint') return -v;
  return raise('TypeError', `bad operand type for unary -: '${typeName(v)}'`);
}

// snapshot of a list for traces (heap.copy())
export const snap = (heap) => heap.slice();

// Python slice bounds for seq[:k] / seq[k:] with an int k
export function sliceIndex(k, len) {
  let i = typeof k === 'bigint' ? k : BigInt(k);
  const n = BigInt(len);
  if (i < 0n) { i += n; if (i < 0n) i = 0n; }
  if (i > n) i = n;
  return Number(i);
}

// seq[0] on a list — IndexError on an empty one
export function first(seq) {
  if (seq.length === 0) raise('IndexError', 'list index out of range');
  return seq[0];
}
