// utils/emulators/python/stdlib/itertools/_pyitertools.js
//
// Port of CPython 3.13's itertools (Modules/itertoolsmodule.c, following
// the "roughly equivalent" Python code in the library docs) for the
// itertools demos — shared by the module hub and every member emulator.
// Not a content page (leading underscore), so the catalog generator never
// maps it.
//
// Every tool is a JS generator over JS iterables, so laziness, consumption
// order and argument checks match CPython: errors in the arguments are
// raised when the iterator is CREATED (call the generator factory), errors
// in the data when it is consumed.
//
// Python value model (shared with the json port, so pyValRepr renders it):
//   None → null · bool → true/false · int → bigint · float → PyFloat
//   str → string · list → Array · tuple → { __pyTuple: [...] }
//
// Demo inputs: numbers typed into a demo are Python literals decided by
// their text (py-num fromLiteral) → pyNum() turns them into bigint/PyFloat.
//
// Browser guard: materialising more than DEMO_LIMIT items stops the demo
// with a 'DemoLimit' error (not a Python exception — CPython would keep
// going, possibly for a very long time).

import { PyException } from '../../../../py-exceptions.js';
import { fromLiteral } from '../../../../py-num.js';
import { PyFloat, asPy, pyValRepr } from '../json/_pyjson.js';

export { PyFloat, asPy, pyValRepr };

export const raise = (type, msg = '') => { throw new PyException(type, msg); };

export const DEMO_LIMIT = 100000;
const tooMany = () => {
  throw new PyException('DemoLimit', `the browser demo stops at ${DEMO_LIMIT.toLocaleString('en-US')} items (CPython would keep going)`);
};

export const MAXSIZE = 9223372036854775807n; // sys.maxsize on 64-bit builds

// ─── values ─────────────────────────────────────────────────

export const tuple = (...items) => ({ __pyTuple: items });
export const isTuple = (v) => v !== null && typeof v === 'object' && Array.isArray(v.__pyTuple);

// a demo number (JS number shown in the code via pyRepr) → bigint | PyFloat
export function pyNum(n) {
  const v = fromLiteral(n);
  return v.int !== undefined ? v.int : new PyFloat(v.float);
}

export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (v instanceof PyFloat) return 'float';
  if (typeof v === 'string') return 'str';
  if (Array.isArray(v)) return 'list';
  if (isTuple(v)) return 'tuple';
  return 'object';
}

const isNum = (v) => typeof v === 'boolean' || typeof v === 'bigint' || v instanceof PyFloat;
const asInt = (v) => (typeof v === 'boolean' ? (v ? 1n : 0n) : v);
const asF = (v) => (v instanceof PyFloat ? v.v : Number(asInt(v)));

function binTypeError(op, a, b) {
  raise('TypeError', `unsupported operand type(s) for ${op}: '${typeName(a)}' and '${typeName(b)}'`);
}

// a + b for the value model (int/float arithmetic, str/list/tuple concat)
export function add(a, b) {
  if (isNum(a) && isNum(b)) {
    if (a instanceof PyFloat || b instanceof PyFloat) return new PyFloat(asF(a) + asF(b));
    return asInt(a) + asInt(b);
  }
  if (typeof a === 'string' && typeof b === 'string') return a + b;
  if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
  if (isTuple(a) && isTuple(b)) return tuple(...a.__pyTuple, ...b.__pyTuple);
  if (typeof a === 'string') raise('TypeError', `can only concatenate str (not "${typeName(b)}") to str`);
  if (Array.isArray(a)) raise('TypeError', `can only concatenate list (not "${typeName(b)}") to list`);
  if (isTuple(a)) raise('TypeError', `can only concatenate tuple (not "${typeName(b)}") to tuple`);
  return binTypeError('+', a, b);
}

export function sub(a, b) {
  if (!isNum(a) || !isNum(b)) binTypeError('-', a, b);
  if (a instanceof PyFloat || b instanceof PyFloat) return new PyFloat(asF(a) - asF(b));
  return asInt(a) - asInt(b);
}

export function mul(a, b) {
  if (isNum(a) && isNum(b)) {
    if (a instanceof PyFloat || b instanceof PyFloat) return new PyFloat(asF(a) * asF(b));
    return asInt(a) * asInt(b);
  }
  return binTypeError('*', a, b);
}

// exact numeric comparison (an int is never rounded to compare with a
// float); NaN compares false both ways. Returns -1/0/1, or NaN for NaN.
function numCmp(a, b) {
  if (!(a instanceof PyFloat) && !(b instanceof PyFloat)) {
    const x = asInt(a);
    const y = asInt(b);
    return x < y ? -1 : x > y ? 1 : 0;
  }
  if (a instanceof PyFloat && b instanceof PyFloat) {
    if (Number.isNaN(a.v) || Number.isNaN(b.v)) return NaN;
    return a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
  }
  const flip = !(a instanceof PyFloat) ? false : true;
  const i = asInt(flip ? b : a);
  const f = (flip ? a : b).v;
  if (Number.isNaN(f)) return NaN;
  let r;
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

// str ordering is by code point (JS < compares UTF-16 units)
function strCmp(a, b) {
  const x = [...a];
  const y = [...b];
  const n = Math.min(x.length, y.length);
  for (let i = 0; i < n; i++) {
    const p = x[i].codePointAt(0);
    const q = y[i].codePointAt(0);
    if (p !== q) return p < q ? -1 : 1;
  }
  return x.length < y.length ? -1 : x.length > y.length ? 1 : 0;
}

// a < b
export function lt(a, b) {
  if (isNum(a) && isNum(b)) return numCmp(a, b) === -1;
  if (typeof a === 'string' && typeof b === 'string') return strCmp(a, b) < 0;
  return raise('TypeError', `'<' not supported between instances of '${typeName(a)}' and '${typeName(b)}'`);
}

// a == b (scalars only — demos never compare containers)
export function eq(a, b) {
  if (isNum(a) && isNum(b)) return numCmp(a, b) === 0;
  return a === b;
}

// max(a, b): the first argument wins ties
export const max2 = (a, b) => (lt(a, b) ? b : a);

export function truthy(v) {
  if (v === null || v === undefined || v === false) return false;
  if (v === true) return true;
  if (typeof v === 'bigint') return v !== 0n;
  if (v instanceof PyFloat) return v.v !== 0; // NaN is truthy
  if (typeof v === 'string') return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (isTuple(v)) return v.__pyTuple.length > 0;
  return true;
}

// len() of a str counts code points
export const pyLen = (v) => (typeof v === 'string' ? [...v].length : Array.isArray(v) ? v.length : v.__pyTuple.length);

// iter(x): str → code points, list → items, tuple → items, generators as is
export function iter(x) {
  if (typeof x === 'string') return [...x][Symbol.iterator]();
  if (Array.isArray(x)) return x[Symbol.iterator]();
  if (isTuple(x)) return x.__pyTuple[Symbol.iterator]();
  if (x && typeof x[Symbol.iterator] === 'function') return x[Symbol.iterator]();
  return raise('TypeError', `'${typeName(x)}' object is not iterable`);
}

// list(it), with the browser guard
export function list(it) {
  const out = [];
  for (const v of it) {
    if (out.length >= DEMO_LIMIT) tooMany();
    out.push(v);
  }
  return out;
}

// next(it, default)
export function next(it, dflt) {
  const r = it.next();
  return r.done ? dflt : r.value;
}

// sys.maxsize-bounded index argument → BigInt, or null for None; a float or
// out-of-range value → null with ok=false (the caller picks the message)
function ssize(v) {
  if (v === null) return { none: true };
  if (typeof v === 'boolean') return { ok: true, n: v ? 1n : 0n };
  if (typeof v !== 'bigint') return { ok: false };
  if (v > MAXSIZE || v < -MAXSIZE - 1n) return { ok: false };
  return { ok: true, n: v };
}

// ─── infinite iterators ─────────────────────────────────────

export function count(start = 0n, step = 1n) {
  if (!isNum(start) || !isNum(step)) raise('TypeError', 'a number is required');
  return (function* gen() {
    let n = start;
    for (;;) {
      yield n;
      n = add(n, step); // repeated addition — float steps accumulate error
    }
  })();
}

export function cycle(iterable) {
  const it = iter(iterable);
  return (function* gen() {
    const saved = [];
    for (const el of it) {
      yield el;
      saved.push(el);
    }
    if (saved.length === 0) return;
    for (;;) yield* saved;
  })();
}

// repeat(object[, times]); times < 0 behaves as 0
export function repeat(object, times) {
  if (times !== undefined) {
    if (times instanceof PyFloat) raise('TypeError', "'float' object cannot be interpreted as an integer");
    if (typeof times !== 'bigint' && typeof times !== 'boolean') {
      raise('TypeError', `'${typeName(times)}' object cannot be interpreted as an integer`);
    }
    const s = ssize(times);
    if (!s.ok) raise('OverflowError', 'Python int too large to convert to C ssize_t');
  }
  return (function* gen() {
    if (times === undefined) for (;;) yield object;
    for (let i = 0n; i < asInt(times); i++) yield object;
  })();
}

// ─── terminating iterators ──────────────────────────────────

export function accumulate(iterable, func = null, initial = null) {
  const it = iter(iterable);
  const f = func || add;
  return (function* gen() {
    let total = initial;
    if (initial !== null) yield total;
    let first = initial === null;
    for (const el of it) {
      if (first) {
        total = el;
        first = false;
      } else {
        total = f(total, el);
      }
      yield total;
    }
  })();
}

export function batched(iterable, n, strict = false) {
  if (n instanceof PyFloat) raise('TypeError', "'float' object cannot be interpreted as an integer");
  const s = ssize(n);
  if (!s.ok) raise('OverflowError', 'Python int too large to convert to C ssize_t');
  if (s.n < 1n) raise('ValueError', 'n must be at least one');
  const it = iter(iterable);
  return (function* gen() {
    for (;;) {
      const batch = [];
      while (BigInt(batch.length) < s.n) {
        const r = it.next();
        if (r.done) break;
        batch.push(r.value);
        if (batch.length > DEMO_LIMIT) tooMany();
      }
      if (batch.length === 0) return;
      if (strict && BigInt(batch.length) !== s.n) raise('ValueError', 'batched(): incomplete batch');
      yield tuple(...batch);
    }
  })();
}

export function chain(...iterables) {
  // chain() accepts anything; iter() is called lazily, one argument at a time
  return (function* gen() {
    for (const x of iterables) yield* iterOf(x);
  })();
}

function* iterOf(x) {
  yield* { [Symbol.iterator]: () => iter(x) };
}

export function chainFromIterable(iterables) {
  const outer = iter(iterables);
  return (function* gen() {
    for (const x of outer) yield* iterOf(x);
  })();
}

export function compress(data, selectors) {
  const d = iter(data);
  const s = iter(selectors);
  return (function* gen() {
    for (;;) {
      const a = d.next();
      if (a.done) return;
      const b = s.next();
      if (b.done) return;
      if (truthy(b.value)) yield a.value;
    }
  })();
}

export function dropwhile(predicate, iterable) {
  const it = iter(iterable);
  return (function* gen() {
    let dropping = true;
    for (const x of it) {
      if (dropping && truthy(predicate(x))) continue;
      dropping = false;
      yield x;
    }
  })();
}

export function takewhile(predicate, iterable) {
  const it = iter(iterable);
  return (function* gen() {
    for (const x of it) {
      if (!truthy(predicate(x))) return;
      yield x;
    }
  })();
}

export function filterfalse(predicate, iterable) {
  const it = iter(iterable);
  return (function* gen() {
    for (const x of it) {
      if (!truthy(predicate === null ? x : predicate(x))) yield x;
    }
  })();
}

// groupby → yields { key, group } where group is a generator sharing the
// underlying iterator: advancing the outer iterator invalidates the
// previous group. Line-by-line port of groupby_next / _grouper_next.
const NULL = Symbol('NULL');
export function groupby(iterable, keyfunc = null) {
  const it = iter(iterable);
  const keyOf = keyfunc || ((x) => x);
  const st = { tgtkey: NULL, currkey: NULL, currvalue: NULL, currgrouper: null };
  const step = () => {
    const r = it.next();
    if (r.done) return false;
    const k = keyOf(r.value);
    st.currvalue = r.value;
    st.currkey = k;
    return true;
  };
  return (function* gen() {
    for (;;) {
      st.currgrouper = null;
      for (;;) {
        if (st.currkey === NULL) { /* pass */ } else if (st.tgtkey === NULL) break;
        else if (!eq(st.tgtkey, st.currkey)) break;
        if (!step()) return;
      }
      st.tgtkey = st.currkey;
      const me = {};
      st.currgrouper = me;
      const group = (function* grouper() {
        for (;;) {
          if (st.currgrouper !== me) return;
          if (st.currvalue === NULL && !step()) return;
          if (!eq(st.tgtkey, st.currkey)) return;
          const v = st.currvalue;
          st.currvalue = NULL;
          yield v;
        }
      })();
      yield { key: st.currkey, group };
    }
  })();
}

// islice(iterable, stop) / islice(iterable, start, stop[, step]) — the
// argument checks of itertoolsmodule.c islice_new, in its order
export function islice(iterable, ...args) {
  let start = 0n;
  let stop = -1n;
  let step = 1n;
  const STOP_MSG = 'Stop argument for islice() must be None or an integer: 0 <= x <= sys.maxsize.';
  const IDX_MSG = 'Indices for islice() must be None or an integer: 0 <= x <= sys.maxsize.';
  if (args.length === 1) {
    const s = ssize(args[0]);
    if (!s.none) {
      if (!s.ok || s.n === -1n) raise('ValueError', STOP_MSG);
      stop = s.n;
    }
  } else {
    const a = ssize(args[0]);
    if (!a.none) start = a.ok ? a.n : -1n;
    const b = ssize(args[1]);
    if (!b.none) {
      if (!b.ok || b.n === -1n) raise('ValueError', STOP_MSG);
      stop = b.n;
    }
  }
  if (start < 0n || stop < -1n) raise('ValueError', IDX_MSG);
  if (args.length === 3 && args[2] !== null) {
    const c = ssize(args[2]);
    step = c.ok ? c.n : -1n;
  }
  if (step < 1n) raise('ValueError', 'Step for islice() must be a positive integer or None.');
  const it = iter(iterable);
  return (function* gen() {
    let cnt = 0n;
    let nxt = start;
    for (;;) {
      while (cnt < nxt) {
        if (it.next().done) return;
        cnt += 1n;
      }
      if (stop !== -1n && cnt >= stop) return;
      const r = it.next();
      if (r.done) return;
      cnt += 1n;
      const old = nxt;
      nxt += step;
      if (nxt < old || (stop !== -1n && nxt > stop)) nxt = stop;
      yield r.value;
    }
  })();
}

export function pairwise(iterable) {
  const it = iter(iterable);
  return (function* gen() {
    const r = it.next();
    if (r.done) return;
    let a = r.value;
    for (const b of it) {
      yield tuple(a, b);
      a = b;
    }
  })();
}

export function starmap(func, iterable) {
  const it = iter(iterable);
  return (function* gen() {
    for (const args of it) {
      const a = [];
      for (const x of iterOf(args)) a.push(x);
      yield func(...a);
    }
  })();
}

// tee(iterable, n=2) → a JS array of n independent iterators
export function tee(iterable, n = 2n) {
  if (n instanceof PyFloat) raise('TypeError', "'float' object cannot be interpreted as an integer");
  const s = ssize(n);
  if (!s.ok) raise('OverflowError', 'Python int too large to convert to C ssize_t');
  if (s.n < 0n) raise('ValueError', 'n must be >= 0');
  if (s.n === 0n) return []; // returns () before iter() is even called
  if (s.n > BigInt(DEMO_LIMIT)) tooMany();
  const it = iter(iterable);
  const buffer = [];
  let done = false;
  const pull = (i) => {
    while (i >= buffer.length) {
      if (done) return false;
      const r = it.next();
      if (r.done) {
        done = true;
        return false;
      }
      buffer.push(r.value);
    }
    return true;
  };
  const make = () => (function* gen() {
    for (let i = 0; ; i++) {
      if (!pull(i)) return;
      yield buffer[i];
    }
  })();
  return Array.from({ length: Number(s.n) }, make);
}

export function zipLongest(iterables, fillvalue = null) {
  const its = iterables.map(iter);
  return (function* gen() {
    if (its.length === 0) return;
    const active = its.map(() => true);
    let left = its.length;
    for (;;) {
      const row = [];
      for (let i = 0; i < its.length; i++) {
        if (!active[i]) {
          row.push(fillvalue);
          continue;
        }
        const r = its[i].next();
        if (r.done) {
          active[i] = false;
          left -= 1;
          if (left === 0) return;
          row.push(fillvalue);
        } else row.push(r.value);
      }
      yield tuple(...row);
    }
  })();
}

// ─── combinatoric iterators ─────────────────────────────────
// Index algorithms of the docs' roughly-equivalent code: output order is
// lexicographic by input POSITION, never by value.

function checkR(r) {
  if (r instanceof PyFloat) raise('TypeError', "'float' object cannot be interpreted as an integer");
  const s = ssize(r);
  if (!s.ok) raise('OverflowError', 'Python int too large to convert to C ssize_t');
  if (s.n < 0n) raise('ValueError', 'r must be non-negative');
  return s.n;
}

// how many results a combinatoric call will produce, for the guard
const guardCount = (big) => {
  if (big > BigInt(DEMO_LIMIT)) tooMany();
};

const binom = (n, k) => {
  if (k < 0n || k > n) return 0n;
  let r = 1n;
  for (let i = 0n; i < k; i++) r = (r * (n - i)) / (i + 1n);
  return r;
};

export function product(iterables, repeatN = 1n) {
  if (repeatN instanceof PyFloat) raise('TypeError', "'float' object cannot be interpreted as an integer");
  const s = ssize(repeatN);
  if (!s.ok) raise('OverflowError', 'Python int too large to convert to C ssize_t');
  if (s.n < 0n) raise('ValueError', 'repeat argument cannot be negative');
  const base = iterables.map((x) => [...iterOf(x)]);
  // guard: tuple width and result count
  if (s.n * BigInt(base.length) > BigInt(DEMO_LIMIT)) tooMany();
  if (!base.some((p) => p.length === 0)) {
    let total = 1n;
    for (let k = 0n; k < s.n; k++) {
      for (const p of base) {
        total *= BigInt(p.length);
        if (total > BigInt(DEMO_LIMIT)) tooMany();
      }
    }
  }
  const pools = [];
  for (let k = 0n; k < s.n; k++) pools.push(...base);
  return (function* gen() {
    let result = [[]];
    for (const pool of pools) {
      const nextRes = [];
      for (const x of result) for (const y of pool) nextRes.push([...x, y]);
      result = nextRes;
    }
    for (const prod of result) yield tuple(...prod);
  })();
}

export function combinations(iterable, r) {
  const rr = checkR(r);
  const pool = [...iterOf(iterable)];
  const n = pool.length;
  guardCount(binom(BigInt(n), rr));
  return (function* gen() {
    if (rr > BigInt(n)) return;
    const k = Number(rr);
    const idx = Array.from({ length: k }, (_, i) => i);
    yield tuple(...idx.map((i) => pool[i]));
    for (;;) {
      let i = k - 1;
      while (i >= 0 && idx[i] === i + n - k) i -= 1;
      if (i < 0) return;
      idx[i] += 1;
      for (let j = i + 1; j < k; j++) idx[j] = idx[j - 1] + 1;
      yield tuple(...idx.map((x) => pool[x]));
    }
  })();
}

export function combinationsWithReplacement(iterable, r) {
  const rr = checkR(r);
  const pool = [...iterOf(iterable)];
  const n = pool.length;
  if (n > 0) guardCount(binom(BigInt(n) + rr - 1n, rr));
  return (function* gen() {
    if (n === 0 && rr > 0n) return;
    const k = Number(rr);
    const idx = new Array(k).fill(0);
    yield tuple(...idx.map((i) => pool[i]));
    for (;;) {
      let i = k - 1;
      while (i >= 0 && idx[i] === n - 1) i -= 1;
      if (i < 0) return;
      const v = idx[i] + 1;
      for (let j = i; j < k; j++) idx[j] = v;
      yield tuple(...idx.map((x) => pool[x]));
    }
  })();
}

export function permutations(iterable, r = null) {
  const pool = [...iterOf(iterable)];
  const n = pool.length;
  if (r instanceof PyFloat) raise('TypeError', 'Expected int as r');
  const rr = r === null ? BigInt(n) : checkR(r);
  if (rr <= BigInt(n)) {
    let total = 1n;
    for (let i = 0n; i < rr; i++) {
      total *= BigInt(n) - i;
      if (total > BigInt(DEMO_LIMIT)) tooMany();
    }
  }
  return (function* gen() {
    if (rr > BigInt(n)) return;
    const k = Number(rr);
    const indices = Array.from({ length: n }, (_, i) => i);
    const cycles = Array.from({ length: k }, (_, i) => n - i);
    yield tuple(...indices.slice(0, k).map((i) => pool[i]));
    if (n === 0) return;
    for (;;) {
      let i = k - 1;
      for (; i >= 0; i--) {
        cycles[i] -= 1;
        if (cycles[i] === 0) {
          const moved = indices[i];
          indices.splice(i, 1);
          indices.push(moved);
          cycles[i] = n - i;
        } else {
          const j = cycles[i];
          const a = indices[i];
          indices[i] = indices[n - j];
          indices[n - j] = a;
          yield tuple(...indices.slice(0, k).map((x) => pool[x]));
          break;
        }
      }
      if (i < 0) return;
    }
  })();
}
