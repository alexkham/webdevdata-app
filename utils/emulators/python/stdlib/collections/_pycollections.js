// utils/emulators/python/stdlib/collections/_pycollections.js
//
// Port of CPython 3.13's collections module (Lib/collections/__init__.py
// for Counter, OrderedDict, ChainMap, namedtuple; Modules/_collectionsmodule.c
// for deque and defaultdict) for the collections demos — shared by the
// module hub and every member emulator. Not a content page (leading
// underscore), so the catalog generator never maps it.
//
// Python value model (same as the json port, plus the collection types):
//   None → null · bool → true/false · int → bigint · float → PyFloat
//   str → string · list → Array · tuple → { __pyTuple: [...] }
//   dict → PyDict (insertion-ordered; Python key equality 1 == 1.0 == True)
//   Counter / OrderedDict / DefaultDict extend PyDict · Deque · ChainMap
//   namedtuple instance → NTInstance
// pyRepr() renders repr() exactly; asPy() wraps a value for the demo box.

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { PyFloat } from '../json/_pyjson.js';

export { PyFloat };
const raise = (type, msg) => { throw new PyException(type, msg); };

// ─── types, equality, hashing ──────────────────────────────

export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (v instanceof PyFloat) return 'float';
  if (typeof v === 'string') return 'str';
  if (Array.isArray(v)) return 'list';
  if (v instanceof Counter) return 'Counter';
  if (v instanceof OrderedDict) return 'OrderedDict';
  if (v instanceof DefaultDict) return 'defaultdict';
  if (v instanceof PyDict) return 'dict';
  if (v instanceof Deque) return 'deque';
  if (v instanceof ChainMap) return 'ChainMap';
  if (v instanceof NTInstance) return v.cls.typename;
  if (v.__pyTuple) return 'tuple';
  return 'object';
}

// numbers: bool / bigint / PyFloat (plain JS integers are accepted as int)
const isNum = (v) => typeof v === 'boolean' || typeof v === 'bigint' || v instanceof PyFloat || typeof v === 'number';
function num(v) {
  if (typeof v === 'boolean') return { i: v ? 1n : 0n };
  if (typeof v === 'bigint') return { i: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { i: BigInt(v) } : { f: v };
  return { f: v.v };
}
const fromNum = (n) => (n.i !== undefined ? n.i : new PyFloat(n.f));
const toF = (n) => (n.i !== undefined ? Number(n.i) : n.f);

function binTypeError(op, a, b) {
  raise('TypeError', `unsupported operand type(s) for ${op}: '${typeName(a)}' and '${typeName(b)}'`);
}
export function add(a, b) {
  if (!isNum(a) || !isNum(b)) {
    if (typeof a === 'string' && typeof b === 'string') return a + b;
    if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
    if (typeof a === 'string' || typeof b === 'string') {
      if (typeof a === 'string' && !isNum(b)) binTypeError('+', a, b);
      raise('TypeError', typeof a === 'string'
        ? `can only concatenate str (not "${typeName(b)}") to str`
        : `unsupported operand type(s) for +: '${typeName(a)}' and '${typeName(b)}'`);
    }
    binTypeError('+', a, b);
  }
  const x = num(a);
  const y = num(b);
  if (x.i !== undefined && y.i !== undefined) return x.i + y.i;
  return new PyFloat(toF(x) + toF(y));
}
export function sub(a, b) {
  if (!isNum(a) || !isNum(b)) binTypeError('-', a, b);
  const x = num(a);
  const y = num(b);
  if (x.i !== undefined && y.i !== undefined) return x.i - y.i;
  return new PyFloat(toF(x) - toF(y));
}

// exact int/float comparison (CPython never rounds the int); NaN → NaN
function numCmp(a, b) {
  const x = num(a);
  const y = num(b);
  if (x.i !== undefined && y.i !== undefined) return x.i < y.i ? -1 : x.i > y.i ? 1 : 0;
  if (x.f !== undefined && y.f !== undefined) {
    if (Number.isNaN(x.f) || Number.isNaN(y.f)) return NaN;
    return x.f < y.f ? -1 : x.f > y.f ? 1 : 0;
  }
  const flip = x.f !== undefined;
  const i = flip ? y.i : x.i;
  const f = flip ? x.f : y.f;
  let r;
  if (Number.isNaN(f)) return NaN;
  if (f === Infinity) r = -1;
  else if (f === -Infinity) r = 1;
  else {
    const fl = BigInt(Math.floor(f));
    if (i < fl) r = -1;
    else if (i > fl) r = 1;
    else r = Number.isInteger(f) ? 0 : -1;
  }
  return flip ? -r : r;
}

export function pyEq(a, b) {
  if (isNum(a) && isNum(b)) return numCmp(a, b) === 0;
  if (a === null || b === null || a === undefined || b === undefined) return a == b; // eslint-disable-line eqeqeq
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => pyEq(v, b[i]));
  }
  if (a.__pyTuple || b.__pyTuple || a instanceof NTInstance || b instanceof NTInstance) {
    const x = tupleItems(a);
    const y = tupleItems(b);
    return x !== null && y !== null && x.length === y.length && x.every((v, i) => pyEq(v, y[i]));
  }
  if (a instanceof Deque || b instanceof Deque) {
    return a instanceof Deque && b instanceof Deque && pyEq(a.items, b.items);
  }
  if (a instanceof Counter && b instanceof Counter) return a.eq(b);
  if (a instanceof OrderedDict && b instanceof OrderedDict) {
    const x = a.items();
    const y = b.items();
    return dictEq(a, b) && x.every(([k], i) => pyEq(k, y[i][0]));
  }
  if (isMapping(a) && isMapping(b)) return dictEq(a, b);
  return a === b;
}
const tupleItems = (v) => (v && v.__pyTuple ? v.__pyTuple : v instanceof NTInstance ? v.values : null);
function dictEq(a, b) {
  if (a.size !== b.size) return false;
  for (const [k, v] of a.items()) {
    if (!b.has(k)) return false;
    if (!pyEq(v, b.getItem(k))) return false;
  }
  return true;
}

// a < b for the values the demos sort (numbers, strs, tuples)
export function pyLt(a, b) {
  if (isNum(a) && isNum(b)) return numCmp(a, b) === -1;
  if (typeof a === 'string' && typeof b === 'string') {
    const x = [...a];
    const y = [...b];
    for (let i = 0; i < Math.min(x.length, y.length); i++) {
      if (x[i] !== y[i]) return x[i].codePointAt(0) < y[i].codePointAt(0);
    }
    return x.length < y.length;
  }
  const x = tupleItems(a);
  const y = tupleItems(b);
  if (x && y) {
    let i = 0;
    while (i < x.length && i < y.length && pyEq(x[i], y[i])) i += 1;
    if (i >= x.length || i >= y.length) return x.length < y.length;
    return pyLt(x[i], y[i]);
  }
  raise('TypeError', `'<' not supported between instances of '${typeName(a)}' and '${typeName(b)}'`);
}

// hash key: equal values (1, 1.0, True) share a key; unhashables raise
function canon(v) {
  if (typeof v === 'string') return 's' + v;
  if (v === null || v === undefined) return 'N';
  if (isNum(v)) {
    const n = num(v);
    if (n.i !== undefined) return 'n' + n.i;
    if (Number.isFinite(n.f) && Number.isInteger(n.f)) return 'n' + BigInt(n.f);
    return 'f' + String(n.f);
  }
  const t = tupleItems(v);
  if (t) return 't' + JSON.stringify(t.map(canon));
  raise('TypeError', `unhashable type: '${typeName(v)}'`);
  return '';
}
export const hashable = (v) => { canon(v); return v; };

// sum(values) as CPython 3.12+ computes it (Python/bltinmodule.c): an
// exact int loop while the running total fits a C long, then — once a
// float arrives — a float loop with Neumaier compensation for floats
// (ints fitting a C long are added uncompensated), else plain `+`.
// C long taken as 64-bit (Linux/macOS); on Windows it is 32-bit, which
// only changes results for ints beyond 2**31 mixed with floats.
const LONG_MAX = 2n ** 63n - 1n;
const LONG_MIN = -(2n ** 63n);
export function pySum(values) {
  let i = 0;
  let result = 0n;
  // 1. exact int loop
  for (; i < values.length; i++) {
    const item = values[i];
    if (typeof item === 'bigint' || typeof item === 'boolean') {
      const b = num(item).i;
      if (b >= LONG_MIN && b <= LONG_MAX && (result >= 0n ? b <= LONG_MAX - result : b >= LONG_MIN - result)) {
        result += b;
        continue;
      }
    }
    result = add(result, item);
    i += 1;
    break;
  }
  // 2. float loop, entered only when step 1 produced a float
  if (result instanceof PyFloat) {
    let f = result.v;
    let c = 0;
    let left = false;
    for (; i < values.length; i++) {
      const item = values[i];
      if (item instanceof PyFloat) {
        const x = item.v;
        const t = f + x;
        if (Math.abs(f) >= Math.abs(x)) c += (f - t) + x;
        else c += (x - t) + f;
        f = t;
        continue;
      }
      if (typeof item === 'bigint' || typeof item === 'boolean') {
        const b = num(item).i;
        if (b >= LONG_MIN && b <= LONG_MAX) { f += Number(b); continue; }
      }
      if (c && Number.isFinite(c)) f += c;
      result = add(new PyFloat(f), item);
      i += 1;
      left = true;
      break;
    }
    if (!left) {
      if (c && Number.isFinite(c)) f += c;
      return new PyFloat(f);
    }
  }
  // 3. generic loop
  for (; i < values.length; i++) result = add(result, values[i]);
  return result;
}

// ─── iteration helpers ─────────────────────────────────────

export function iterate(v) {
  if (typeof v === 'string') return [...v];
  if (Array.isArray(v)) return [...v];
  if (v && v.__pyTuple) return [...v.__pyTuple];
  if (v instanceof NTInstance) return [...v.values];
  if (v instanceof PyDict) return v.keys();
  if (v instanceof Deque) return [...v.items];
  if (v instanceof ChainMap) return v.keys();
  raise('TypeError', `'${typeName(v)}' object is not iterable`);
  return [];
}
const isMapping = (v) => v instanceof PyDict || v instanceof ChainMap;

// str.split() with no arguments: runs of Unicode whitespace (str.isspace)
const PY_WS = /[\t\n\x0b\x0c\r\x1c-\x1f \x85\xa0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+/;
export const pySplit = (s) => s.split(PY_WS).filter((x) => x !== '');
export const pyLen = (v) => {
  if (typeof v === 'string') return BigInt([...v].length);
  if (Array.isArray(v)) return BigInt(v.length);
  if (v instanceof PyDict || v instanceof ChainMap) return BigInt(v.size);
  if (v instanceof Deque) return BigInt(v.items.length);
  const t = tupleItems(v);
  if (t) return BigInt(t.length);
  raise('TypeError', `object of type '${typeName(v)}' has no len()`);
  return 0n;
};
// s[i] for a str (code points)
export function strIndex(s, i) {
  const cps = [...s];
  let k = Number(i);
  if (k < 0) k += cps.length;
  if (k < 0 || k >= cps.length) raise('IndexError', 'string index out of range');
  return cps[k];
}

// ─── repr ──────────────────────────────────────────────────

export function pyRepr(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : pyFloatRepr(v);
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  if (typeof v === 'string') return pyStrRepr(v);
  if (Array.isArray(v)) return '[' + v.map(pyRepr).join(', ') + ']';
  if (v.__pyTuple) {
    const items = v.__pyTuple.map(pyRepr);
    return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
  }
  if (typeof v.repr === 'function') return v.repr();
  if (v.__pyRaw !== undefined) return v.__pyRaw;
  return String(v);
}
export const asPy = (v) => ({ __pyRaw: pyRepr(v) });
export const tuple = (...items) => ({ __pyTuple: items });

// ─── dict ──────────────────────────────────────────────────

export class PyDict {
  constructor(pairs = []) {
    this.m = new Map();
    for (const [k, v] of pairs) this.setItem(k, v);
  }
  get size() { return this.m.size; }
  has(k) { return this.m.has(canon(k)); }
  missing(k) { raise('KeyError', pyRepr(k)); }
  getItem(k) {
    const e = this.m.get(canon(k));
    return e ? e[1] : this.missing(k);
  }
  get(k, dflt = null) {
    const e = this.m.get(canon(k));
    return e ? e[1] : dflt;
  }
  setItem(k, v) {
    const c = canon(k);
    const e = this.m.get(c);
    if (e) e[1] = v; // first key object kept, value replaced
    else this.m.set(c, [k, v]);
  }
  delItem(k) {
    const c = canon(k);
    if (!this.m.has(c)) raise('KeyError', pyRepr(k));
    this.m.delete(c);
  }
  keys() { return [...this.m.values()].map((e) => e[0]); }
  values() { return [...this.m.values()].map((e) => e[1]); }
  items() { return [...this.m.values()].map((e) => [e[0], e[1]]); }
  // pop(k[, default]) — pass NO_DEFAULT for the one-argument form
  pop(k, dflt = NO_DEFAULT) {
    const c = canon(k);
    const e = this.m.get(c);
    if (!e) {
      if (dflt === NO_DEFAULT) raise('KeyError', pyRepr(k));
      return dflt;
    }
    this.m.delete(c);
    return e[1];
  }
  popitem() {
    if (this.m.size === 0) raise('KeyError', pyStrRepr('popitem(): dictionary is empty'));
    const last = [...this.m.keys()].pop();
    const [k, v] = this.m.get(last);
    this.m.delete(last);
    return tuple(k, v);
  }
  setdefault(k, dflt = null) {
    const c = canon(k);
    const e = this.m.get(c);
    if (e) return e[1];
    this.m.set(c, [k, dflt]);
    return dflt;
  }
  // dict.update(mapping or iterable of pairs)
  update(other) {
    if (other instanceof PyDict) {
      for (const [k, v] of other.items()) this.setItem(k, v);
    } else if (other instanceof ChainMap) {
      for (const k of other.keys()) this.setItem(k, other.getItem(k));
    } else {
      iterate(other).forEach((pair, i) => {
        const kv = typeof pair === 'string' ? [...pair] : tupleItems(pair) || (Array.isArray(pair) ? pair : null);
        if (kv === null) raise('TypeError', `cannot convert dictionary update sequence element #${i} to a sequence`);
        if (kv.length !== 2) raise('ValueError', `dictionary update sequence element #${i} has length ${kv.length}; 2 is required`);
        this.setItem(kv[0], kv[1]);
      });
    }
  }
  clear() { this.m.clear(); }
  copy() { return new PyDict(this.items()); }
  body() { return '{' + this.items().map(([k, v]) => `${pyRepr(k)}: ${pyRepr(v)}`).join(', ') + '}'; }
  repr() { return this.body(); }
}
export const NO_DEFAULT = Symbol('no default');
export const dictFromkeys = (iterable, value = null) => new PyDict(iterate(iterable).map((k) => [k, value]));

// ─── Counter ───────────────────────────────────────────────

export class Counter extends PyDict {
  // Counter(iterable=None, /, **kwds) → self.update(iterable)
  constructor(iterable = null) {
    super();
    if (iterable !== null) this.update(iterable);
  }
  missing() { return 0n; }
  delItem(k) { if (this.has(k)) super.delItem(k); }
  // update: counts ADD. A mapping into an empty Counter is dict.update.
  update(iterable = null) {
    if (iterable === null) return;
    if (isMapping(iterable)) {
      if (this.size > 0) {
        for (const [elem, count] of mappingItems(iterable)) this.setItem(elem, add(count, this.get(elem, 0n)));
      } else {
        PyDict.prototype.update.call(this, iterable);
      }
    } else {
      for (const elem of iterate(iterable)) this.setItem(elem, add(this.get(elem, 0n), 1n));
    }
  }
  subtract(iterable = null) {
    if (iterable === null) return;
    if (isMapping(iterable)) {
      for (const [elem, count] of mappingItems(iterable)) this.setItem(elem, sub(this.get(elem, 0n), count));
    } else {
      for (const elem of iterate(iterable)) this.setItem(elem, sub(this.get(elem, 0n), 1n));
    }
  }
  total() { return pySum(this.values()); }
  // sorted(items, key=count, reverse=True)[:n] — heapq.nlargest gives the
  // same order (ties stay in insertion order)
  mostCommon(n = null) {
    const items = this.items();
    items.forEach(([, c]) => { if (!isNum(c)) raise('TypeError', `'<' not supported between instances of '${typeName(c)}' and 'int'`); });
    const sorted = items
      .map((kv, i) => ({ kv, i }))
      .sort((a, b) => {
        if (pyLt(b.kv[1], a.kv[1])) return -1;
        if (pyLt(a.kv[1], b.kv[1])) return 1;
        return a.i - b.i;
      })
      .map((x) => tuple(x.kv[0], x.kv[1]));
    if (n === null) return sorted;
    const k = Number(n);
    return k <= 0 ? [] : sorted.slice(0, k);
  }
  elements() {
    const out = [];
    for (const [elem, count] of this.items()) {
      if (!(typeof count === 'bigint' || typeof count === 'boolean')) {
        raise('TypeError', `'${typeName(count)}' object cannot be interpreted as an integer`);
      }
      const n = typeof count === 'boolean' ? (count ? 1 : 0) : Number(count);
      for (let i = 0; i < n; i++) out.push(elem);
    }
    return out;
  }
  copy() { return new Counter(this); }
  static fromkeys() {
    raise('NotImplementedError', 'Counter.fromkeys() is undefined.  Use Counter(iterable) instead.');
  }
  repr() {
    if (this.size === 0) return 'Counter()';
    let d;
    try {
      d = new PyDict(this.mostCommon().map((t) => t.__pyTuple));
    } catch (e) {
      if (!(e instanceof PyException) || e.name !== 'TypeError') throw e;
      d = new PyDict(this.items());
    }
    return `Counter(${d.body()})`;
  }
  // multiset maths: results keep only positive counts
  plus(other) {
    checkCounter('+', this, other);
    const r = new Counter();
    for (const [elem, count] of this.items()) {
      const c = add(count, other.getItem(elem));
      if (numCmp(c, 0n) > 0) r.setItem(elem, c);
    }
    for (const [elem, count] of other.items()) {
      if (!this.has(elem) && numCmp(count, 0n) > 0) r.setItem(elem, count);
    }
    return r;
  }
  minus(other) {
    checkCounter('-', this, other);
    const r = new Counter();
    for (const [elem, count] of this.items()) {
      const c = sub(count, other.getItem(elem));
      if (numCmp(c, 0n) > 0) r.setItem(elem, c);
    }
    for (const [elem, count] of other.items()) {
      if (!this.has(elem) && numCmp(count, 0n) < 0) r.setItem(elem, sub(0n, count));
    }
    return r;
  }
  or(other) {
    checkCounter('|', this, other);
    const r = new Counter();
    for (const [elem, count] of this.items()) {
      const oc = other.getItem(elem);
      const c = numCmp(count, oc) < 0 ? oc : count;
      if (numCmp(c, 0n) > 0) r.setItem(elem, c);
    }
    for (const [elem, count] of other.items()) {
      if (!this.has(elem) && numCmp(count, 0n) > 0) r.setItem(elem, count);
    }
    return r;
  }
  and(other) {
    checkCounter('&', this, other);
    const r = new Counter();
    for (const [elem, count] of this.items()) {
      const oc = other.getItem(elem);
      const c = numCmp(count, oc) < 0 ? count : oc;
      if (numCmp(c, 0n) > 0) r.setItem(elem, c);
    }
    return r;
  }
  pos() {
    const r = new Counter();
    for (const [elem, count] of this.items()) if (numCmp(count, 0n) > 0) r.setItem(elem, count);
    return r;
  }
  neg() {
    const r = new Counter();
    for (const [elem, count] of this.items()) if (numCmp(count, 0n) < 0) r.setItem(elem, sub(0n, count));
    return r;
  }
  keepPositive() {
    for (const [elem, count] of this.items()) if (!(numCmp(count, 0n) > 0)) PyDict.prototype.delItem.call(this, elem);
    return this;
  }
  iadd(other) {
    for (const [elem, count] of other.items()) this.setItem(elem, add(this.getItem(elem), count));
    return this.keepPositive();
  }
  isub(other) {
    for (const [elem, count] of other.items()) this.setItem(elem, sub(this.getItem(elem), count));
    return this.keepPositive();
  }
  ior(other) {
    for (const [elem, oc] of other.items()) {
      const c = this.getItem(elem);
      if (numCmp(oc, c) > 0) this.setItem(elem, oc);
    }
    return this.keepPositive();
  }
  iand(other) {
    for (const [elem, count] of this.items()) {
      const oc = other.getItem(elem);
      if (numCmp(oc, count) < 0) this.setItem(elem, oc);
    }
    return this.keepPositive();
  }
  // rich comparisons (3.10+): missing elements count as zero
  eq(other) {
    return [this, other].every((c) => c.keys().every((e) => pyEq(this.getItem(e), other.getItem(e))));
  }
  le(other) {
    return [this, other].every((c) => c.keys().every((e) => numCmp(this.getItem(e), other.getItem(e)) <= 0));
  }
  lt(other) { return this.le(other) && !this.eq(other); }
}
function checkCounter(op, a, b) {
  if (!(b instanceof Counter)) binTypeError(op, a, b);
}
const mappingItems = (m) => (m instanceof ChainMap ? m.keys().map((k) => [k, m.getItem(k)]) : m.items());

// ─── OrderedDict ───────────────────────────────────────────

export class OrderedDict extends PyDict {
  moveToEnd(key, last = true) {
    const c = canon(key);
    const e = this.m.get(c);
    if (!e) raise('KeyError', pyRepr(key));
    this.m.delete(c);
    if (last) this.m.set(c, e);
    else this.m = new Map([[c, e], ...this.m]);
  }
  popitem(last = true) {
    if (this.m.size === 0) raise('KeyError', pyStrRepr('dictionary is empty'));
    const keys = [...this.m.keys()];
    const c = last ? keys[keys.length - 1] : keys[0];
    const [k, v] = this.m.get(c);
    this.m.delete(c);
    return tuple(k, v);
  }
  copy() { return new OrderedDict(this.items()); }
  repr() { return this.size === 0 ? 'OrderedDict()' : `OrderedDict(${this.body()})`; }
}
export const odFromkeys = (iterable, value = null) => new OrderedDict(iterate(iterable).map((k) => [k, value]));

// ─── defaultdict ───────────────────────────────────────────

// default factories the demos use: repr + how to make a fresh value
export const FACTORIES = {
  list:  { repr: "<class 'list'>", make: () => [] },
  int:   { repr: "<class 'int'>", make: () => 0n },
  str:   { repr: "<class 'str'>", make: () => '' },
  set:   { repr: "<class 'set'>", make: () => ({ __pyRaw: 'set()' }) },
  dict:  { repr: "<class 'dict'>", make: () => new PyDict() },
};

export class DefaultDict extends PyDict {
  constructor(factory = null, pairs = []) {
    super(pairs);
    this.defaultFactory = factory;
  }
  // __missing__: KeyError without a factory, else insert factory()
  missing(k) {
    if (this.defaultFactory === null) raise('KeyError', pyRepr(k));
    const v = this.defaultFactory.make();
    this.setItem(k, v);
    return v;
  }
  copy() { return new DefaultDict(this.defaultFactory, this.items()); }
  repr() {
    return `defaultdict(${this.defaultFactory === null ? 'None' : this.defaultFactory.repr}, ${this.body()})`;
  }
}

// ─── deque ─────────────────────────────────────────────────

const toIndex = (n) => {
  if (typeof n === 'bigint') return Number(n);
  if (typeof n === 'boolean') return n ? 1 : 0;
  if (typeof n === 'number' && Number.isInteger(n)) return n;
  raise('TypeError', `'${typeName(n)}' object cannot be interpreted as an integer`);
  return 0;
};

export class Deque {
  constructor(iterable = [], maxlen = null) {
    if (maxlen !== null) {
      maxlen = toIndex(maxlen);
      if (maxlen < 0) raise('ValueError', 'maxlen must be non-negative');
    }
    this.maxlen = maxlen;
    this.items = [];
    this.extend(iterable);
  }
  append(x) {
    if (this.maxlen === 0) return;
    this.items.push(x);
    if (this.maxlen !== null && this.items.length > this.maxlen) this.items.shift();
  }
  appendleft(x) {
    if (this.maxlen === 0) return;
    this.items.unshift(x);
    if (this.maxlen !== null && this.items.length > this.maxlen) this.items.pop();
  }
  pop() {
    if (this.items.length === 0) raise('IndexError', 'pop from an empty deque');
    return this.items.pop();
  }
  popleft() {
    if (this.items.length === 0) raise('IndexError', 'pop from an empty deque');
    return this.items.shift();
  }
  extend(iterable) {
    for (const x of iterate(iterable)) this.append(x); // iterate() copies, so d.extend(d) works
  }
  extendleft(iterable) {
    for (const x of iterate(iterable)) this.appendleft(x);
  }
  rotate(n = 1n) {
    const k = toIndex(n);
    const len = this.items.length;
    if (len <= 1) return;
    const r = ((k % len) + len) % len;
    if (r) this.items = [...this.items.slice(len - r), ...this.items.slice(0, len - r)];
  }
  reverse() { this.items.reverse(); }
  clear() { this.items = []; }
  copy() {
    const d = new Deque([], this.maxlen);
    d.items = [...this.items];
    return d;
  }
  count(x) { return BigInt(this.items.filter((v) => pyEq(v, x)).length); }
  index(x, start = 0n, stop = null) {
    const len = this.items.length;
    let s = toIndex(start);
    let e = stop === null ? len : toIndex(stop);
    if (s < 0) s = Math.max(0, s + len);
    if (e < 0) e = Math.max(0, e + len);
    e = Math.min(e, len);
    for (let i = s; i < e; i++) if (pyEq(this.items[i], x)) return BigInt(i);
    raise('ValueError', `${pyRepr(x)} is not in deque`);
    return 0n;
  }
  insert(i, x) {
    const len = this.items.length;
    if (this.maxlen !== null && len >= this.maxlen) raise('IndexError', 'deque already at its maximum size');
    let k = toIndex(i);
    if (k < 0) k = Math.max(0, k + len);
    k = Math.min(k, len);
    this.items.splice(k, 0, x);
  }
  remove(x) {
    const i = this.items.findIndex((v) => pyEq(v, x));
    if (i === -1) raise('ValueError', `${pyRepr(x)} is not in deque`);
    this.items.splice(i, 1);
  }
  getItem(i) {
    let k = toIndex(i);
    if (k < 0) k += this.items.length;
    if (k < 0 || k >= this.items.length) raise('IndexError', 'deque index out of range');
    return this.items[k];
  }
  repr() {
    const body = '[' + this.items.map(pyRepr).join(', ') + ']';
    return this.maxlen === null ? `deque(${body})` : `deque(${body}, maxlen=${this.maxlen})`;
  }
}

// ─── ChainMap ──────────────────────────────────────────────

export class ChainMap {
  constructor(...maps) {
    this.maps = maps.length ? maps : [new PyDict()];
  }
  has(k) { return this.maps.some((m) => m.has(k)); }
  getItem(k) {
    for (const m of this.maps) if (m.has(k)) return m.getItem(k);
    raise('KeyError', pyRepr(k));
    return null;
  }
  get(k, dflt = null) { return this.has(k) ? this.getItem(k) : dflt; }
  // iteration: dict.fromkeys over the maps from LAST to first
  keys() {
    const d = new PyDict();
    for (const m of [...this.maps].reverse()) for (const k of iterate(m)) d.setItem(k, null);
    return d.keys();
  }
  get size() { return this.keys().length; }
  setItem(k, v) { this.maps[0].setItem(k, v); }
  delItem(k) {
    if (!this.maps[0].has(k)) raise('KeyError', pyStrRepr(`Key not found in the first mapping: ${pyRepr(k)}`));
    this.maps[0].delItem(k);
  }
  pop(k, dflt = NO_DEFAULT) {
    if (!this.maps[0].has(k) && dflt === NO_DEFAULT) {
      raise('KeyError', pyStrRepr(`Key not found in the first mapping: ${pyRepr(k)}`));
    }
    return this.maps[0].pop(k, dflt);
  }
  popitem() {
    if (this.maps[0].size === 0) raise('KeyError', pyStrRepr('No keys found in the first mapping.'));
    return this.maps[0].popitem();
  }
  clear() { this.maps[0].clear(); }
  newChild(m = null) { return new ChainMap(m === null ? new PyDict() : m, ...this.maps); }
  get parents() { return new ChainMap(...this.maps.slice(1)); }
  copy() { return new ChainMap(this.maps[0].copy(), ...this.maps.slice(1)); }
  static fromkeys(iterable, value = null) { return new ChainMap(dictFromkeys(iterable, value)); }
  toDict() { return new PyDict(this.keys().map((k) => [k, this.getItem(k)])); }
  repr() { return `ChainMap(${this.maps.map(pyRepr).join(', ')})`; }
}

// ─── namedtuple ────────────────────────────────────────────

const KEYWORDS = new Set(['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
  'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda',
  'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']);
// str.isidentifier (no NFKC step — that only applies to source code)
const isIdentifier = (s) => /^[\p{XID_Start}_][\p{XID_Continue}]*$/u.test(s);

export class NTClass {
  constructor(typename, fieldNames, { rename = false, defaults = null } = {}) {
    let fields = typeof fieldNames === 'string' ? pySplit(fieldNames.replace(/,/g, ' ')) : iterate(fieldNames);
    fields = fields.map((f) => (typeof f === 'string' ? f : pyStr(f)));
    if (rename) {
      const seen = new Set();
      fields = fields.map((name, i) => {
        const bad = !isIdentifier(name) || KEYWORDS.has(name) || name.startsWith('_') || seen.has(name);
        seen.add(name);
        return bad ? `_${i}` : name;
      });
    }
    for (const name of [typename, ...fields]) {
      if (!isIdentifier(name)) raise('ValueError', `Type names and field names must be valid identifiers: ${pyStrRepr(name)}`);
      if (KEYWORDS.has(name)) raise('ValueError', `Type names and field names cannot be a keyword: ${pyStrRepr(name)}`);
    }
    const seen = new Set();
    for (const name of fields) {
      if (name.startsWith('_') && !rename) raise('ValueError', `Field names cannot start with an underscore: ${pyStrRepr(name)}`);
      if (seen.has(name)) raise('ValueError', `Encountered duplicate field name: ${pyStrRepr(name)}`);
      seen.add(name);
    }
    let dflts = [];
    if (defaults !== null) {
      dflts = iterate(defaults);
      if (dflts.length > fields.length) raise('TypeError', 'Got more default values than field names');
    }
    this.typename = typename;
    this.fields = fields;
    this.defaults = dflts;
  }
  get _fields() { return tuple(...this.fields); }
  // Point(*args) — positional only (keywords are not needed by the demos)
  call(...args) {
    const n = this.fields.length;
    if (args.length > n) {
      const lo = n + 1 - this.defaults.length;
      const takes = lo === n + 1 ? `${n + 1} positional argument${n === 0 ? '' : 's'}` : `from ${lo} to ${n + 1} positional arguments`;
      raise('TypeError', `${this.typename}.__new__() takes ${takes} but ${args.length + 1} were given`);
    }
    const firstDefault = n - this.defaults.length;
    const values = this.fields.map((f, i) => (i < args.length ? args[i] : i >= firstDefault ? this.defaults[i - firstDefault] : NO_DEFAULT));
    const missing = this.fields.filter((f, i) => values[i] === NO_DEFAULT);
    if (missing.length) {
      const q = missing.map((m) => `'${m}'`);
      const list = q.length === 1 ? q[0] : q.length === 2 ? `${q[0]} and ${q[1]}` : `${q.slice(0, -1).join(', ')}, and ${q[q.length - 1]}`;
      raise('TypeError', `${this.typename}.__new__() missing ${missing.length} required positional argument${missing.length > 1 ? 's' : ''}: ${list}`);
    }
    return new NTInstance(this, values);
  }
  _make(iterable) {
    const values = iterate(iterable);
    if (values.length !== this.fields.length) {
      raise('TypeError', `Expected ${this.fields.length} arguments, got ${values.length}`);
    }
    return new NTInstance(this, values);
  }
}
const pyStr = (v) => (typeof v === 'string' ? v : pyRepr(v));

export class NTInstance {
  constructor(cls, values) {
    this.cls = cls;
    this.values = values;
  }
  attr(name) {
    const i = this.cls.fields.indexOf(name);
    if (i === -1) raise('AttributeError', `'${this.cls.typename}' object has no attribute ${pyStrRepr(name)}`);
    return this.values[i];
  }
  _asdict() { return new PyDict(this.cls.fields.map((f, i) => [f, this.values[i]])); }
  // _replace(**kwds) — kwds as [name, value] pairs
  _replace(kwds) {
    const values = [...this.values];
    const unknown = [];
    for (const [name, v] of kwds) {
      const i = this.cls.fields.indexOf(name);
      if (i === -1) unknown.push(name);
      else values[i] = v;
    }
    if (unknown.length) raise('TypeError', `Got unexpected field names: ${pyRepr(unknown)}`);
    return new NTInstance(this.cls, values);
  }
  repr() {
    return `${this.cls.typename}(${this.cls.fields.map((f, i) => `${f}=${pyRepr(this.values[i])}`).join(', ')})`;
  }
}

// ─── demo-input helpers ────────────────────────────────────

// a JS number typed into a demo → the Python value of its literal text
// (the snippet shows pyRepr(n): '3' is an int, '2.5' a float)
export function pyNumber(n) {
  if (typeof n === 'bigint') return n;
  const text = String(n);
  if (text === 'Infinity' || text === '-Infinity') {
    raise('NameError', "name 'inf' is not defined. Did you mean: 'int'?");
  }
  if (/[.eE]/.test(text)) return new PyFloat(n);
  return BigInt(text);
}
// zip(a, b) as a list of 2-tuples' item arrays
export const zipPairs = (a, b) => {
  const x = iterate(a);
  const y = iterate(b);
  return x.slice(0, Math.min(x.length, y.length)).map((v, i) => [v, y[i]]);
};
