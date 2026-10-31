// utils/emulators/python/stdlib/pprint/_pypprint.js
//
// Port of CPython 3.13's Lib/pprint.py for the pprint demos: PrettyPrinter
// (_format, the per-type _pprint_* layouts, _format_items with compact,
// _format_dict_items, the string and bytes wrappers, _safe_repr with
// depth, sort_dicts and underscore_numbers), pformat / pprint / pp and
// saferepr / isreadable / isrecursive. Not a content page (leading
// underscore), so the catalog generator never maps it.
//
// Values use the literal model of ../pickle/_pypickle.js — what
// ast.literal_eval (../pickle/_pyliteral.js) builds: None → null, bool,
// int → bigint, float → PyFloat, str → PyStr, bytes → PyBytes, list /
// tuple / dict / set → PyList / PyTuple / PyDict / PySet. Sets keep
// CPython's hash-table order (emulated in _pypickle.js).
//
// sorted(..., key=_safe_key) follows list.sort exactly: _safe_key.__lt__
// tries <, and on TypeError compares (str(type), id) — so the type name
// decides between different types, and id() (a memory address) between
// two incomparable values of the same type. Sorts of up to 63 items run
// CPython's own algorithm (count_run + binary insertion, which is all
// timsort does below 64 items), so even orders that are not transitive
// (True < b'x' < 0.5 < True by those rules) come out as in CPython.
//
// Text that CPython itself prints differently from run to run stops with
// a DemoLimit instead: a set of strings shown in hash order (str hashes
// are randomized per process) and the id= in <Recursion on … with id=…>
// (whose digit count even changes the layout, since it counts toward the
// width).
//
// Differentially fuzzed against CPython 3.13.3 (Windows) and 3.12.3
// (Linux): pformat / pprint / pp / saferepr / isreadable / isrecursive and
// the PrettyPrinter methods on tens of thousands of random literals (nested
// dict / list / tuple / set / str / bytes / int / float / bool / None, long
// and multi-line strings, mixed-type keys) with random width, indent,
// depth, compact, sort_dicts and underscore_numbers — identical wherever
// the output is reproducible; the rest stops with a DemoLimit.

import { PyFloat, PyStr, PyBytes, PyList, PyTuple, PyDict, PySet, typeName, bytesRepr, intRepr, limit } from '../pickle/_pypickle.js';
import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

const raise = (type, msg) => { throw new PyException(type, msg); };

// markers inside repr text (raw control characters never occur in a repr:
// repr escapes them) — zero width for len(), checked when text is shown
const HASH_ORDER = '\u0001';
const ADDRESS = '\u0002';
const MAX_OUTPUT = 200000;

// len() of repr text: code points, markers excluded
export function plen(s) {
  let n = 0;
  for (const ch of s) if (ch !== HASH_ORDER && ch !== ADDRESS) n++;
  return n;
}

// text a demo shows: stop where CPython's own output is not reproducible
export function shown(text) {
  if (text.includes(HASH_ORDER)) {
    limit('this set is printed in hash order, and str/bytes hashes change from run to run (PYTHONHASHSEED), so CPython itself prints a different order each time');
  }
  if (text.includes(ADDRESS)) {
    limit('the output contains id= — a memory address that differs on every run');
  }
  return text;
}

// ─── repr() ─────────────────────────────────────────────────

const setItems = (s) => (s.random ? [...s.byKey.values()].map((e) => e.key) : s.items());

// repr(v). A container that is already being shown prints as [...], {...},
// (...) or set(...) — Py_ReprEnter, as list/dict/tuple/set repr do.
export function rawRepr(v, active = new Set()) {
  if (v === null) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return intRepr(v);
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  if (v instanceof PyStr) return pyStrRepr(v.v);
  if (v instanceof PyBytes) return bytesRepr(v.b);
  if (!(v instanceof PyList || v instanceof PyTuple || v instanceof PyDict || v instanceof PySet)) {
    return limit(`repr of a ${typeName(v)} is not part of the demo`);
  }
  if (active.has(v)) {
    if (v instanceof PyList) return '[...]';
    if (v instanceof PyDict) return '{...}';
    if (v instanceof PyTuple) return '(...)';
    return `${typeName(v)}(...)`;
  }
  if (active.size > 200) limit('the demo stops at 200 levels of nesting');
  active.add(v);
  const inner = (x) => rawRepr(x, active);
  let out;
  if (v instanceof PyList) out = '[' + v.items.map(inner).join(', ') + ']';
  else if (v instanceof PyTuple) {
    const parts = v.items.map(inner);
    out = '(' + parts.join(', ') + (parts.length === 1 ? ',' : '') + ')';
  } else if (v instanceof PyDict) out = '{' + v.keys.map((k, i) => `${inner(k)}: ${inner(v.vals[i])}`).join(', ') + '}';
  else if (v.size === 0) out = v.frozen ? 'frozenset()' : 'set()';
  else {
    const body = '{' + setItems(v).map(inner).join(', ') + '}';
    const text = v.frozen ? `frozenset(${body})` : body;
    out = v.random && v.size > 1 ? HASH_ORDER + text : text;
  }
  active.delete(v);
  return out;
}

// ─── demo glue ──────────────────────────────────────────────

// text.splitlines() for pformat output: a repr escapes every other line
// boundary, so '\n' is the only one that occurs
export const splitLines = (text) => (text === '' ? [] : text.split('\n'));

// What a demo shows for a snippet that prints and then ends with an
// expression: stdout (trailing newlines trimmed), then the repr.
export function withStdout(stdout, finalRepr) {
  const out = stdout.replace(/\n+$/, '');
  return { __pyRaw: out ? `${out}\n${finalRepr}` : finalRepr };
}

// for item in value: — list/tuple items, dict keys, str characters, bytes
// as ints, set items in iteration order
export function iterate(v) {
  if (v instanceof PyList || v instanceof PyTuple) return v.items;
  if (v instanceof PyDict) return v.keys;
  if (v instanceof PyStr) return [...v.v].map((ch) => new PyStr(ch));
  if (v instanceof PyBytes) return [...v.b].map((b) => BigInt(b));
  if (v instanceof PySet) return v.items();
  return raise('TypeError', `'${typeName(v)}' object is not iterable`);
}

// '…'.replace(f'id={id(obj)}', 'id=ID') on text whose recursion markers
// all refer to obj
export const addressAs = (text, label) => text.split(`id=${ADDRESS}`).join(`id=${label}`);

const recursionText = (v) => `<Recursion on ${typeName(v)} with id=${ADDRESS}>`;

// f"{n:_d}"
function underscored(n) {
  const neg = n < 0n;
  const digits = intRepr(neg ? -n : n);
  let out = '';
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += '_';
    out += digits[i];
  }
  return neg ? '-' + out : out;
}

// ─── comparisons (the < that _safe_key tries) ───────────────

const TYPE_ERROR = { typeError: true };
const numOf = (v) => (typeof v === 'bigint' ? v : v === true ? 1n : v === false ? 0n : v instanceof PyFloat ? v.v : undefined);

// exact int/float comparison: -1, 0, 1
function numCmp(a, b) {
  if (typeof a === 'bigint' && typeof b === 'bigint') return a < b ? -1 : a > b ? 1 : 0;
  if (typeof a === 'number' && typeof b === 'number') return a < b ? -1 : a > b ? 1 : 0;
  const flip = typeof a === 'number';
  const i = flip ? b : a;
  const f = flip ? a : b;
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
function cpCmp(x, y) {
  const a = [...x];
  const b = [...y];
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const d = a[i].codePointAt(0) - b[i].codePointAt(0);
    if (d) return d < 0 ? -1 : 1;
  }
  return a.length < b.length ? -1 : a.length > b.length ? 1 : 0;
}
function bytesCmp(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  return a.length < b.length ? -1 : a.length > b.length ? 1 : 0;
}
// a == b (never raises for these types)
function pyEq(a, b) {
  if (a === b) return true;
  const x = numOf(a);
  const y = numOf(b);
  if (x !== undefined || y !== undefined) return x !== undefined && y !== undefined && numCmp(x, y) === 0;
  if (a instanceof PyStr) return b instanceof PyStr && a.v === b.v;
  if (a instanceof PyBytes) return b instanceof PyBytes && bytesCmp(a.b, b.b) === 0;
  if ((a instanceof PyTuple && b instanceof PyTuple) || (a instanceof PyList && b instanceof PyList)) {
    return a.items.length === b.items.length && a.items.every((v, i) => pyEq(v, b.items[i]));
  }
  if (a instanceof PySet && b instanceof PySet) {
    return a.size === b.size && [...a.byKey.keys()].every((k) => b.byKey.has(k));
  }
  return false;
}
// a < b, or throw TYPE_ERROR where Python raises TypeError
function pyLt(a, b) {
  const x = numOf(a);
  const y = numOf(b);
  if (x !== undefined && y !== undefined) return numCmp(x, y) < 0;
  if (a instanceof PyStr && b instanceof PyStr) return cpCmp(a.v, b.v) < 0;
  if (a instanceof PyBytes && b instanceof PyBytes) return bytesCmp(a.b, b.b) < 0;
  if ((a instanceof PyTuple && b instanceof PyTuple) || (a instanceof PyList && b instanceof PyList)) {
    const n = Math.min(a.items.length, b.items.length);
    for (let i = 0; i < n; i++) {
      if (!pyEq(a.items[i], b.items[i])) return pyLt(a.items[i], b.items[i]);
    }
    return a.items.length < b.items.length;
  }
  if (a instanceof PySet && b instanceof PySet) {
    // proper subset
    return a.size < b.size && [...a.byKey.keys()].every((k) => b.byKey.has(k));
  }
  throw TYPE_ERROR;
}

const typeStr = (v) => `<class '${typeName(v)}'>`;
const SAME_TYPE_ID = 'the order of these items depends on id() — memory addresses — because they cannot be compared with <';

// _safe_key(a) < _safe_key(b)
function safeLt(a, b) {
  try {
    return pyLt(a, b);
  } catch (e) {
    if (e !== TYPE_ERROR) throw e;
    const ta = typeStr(a);
    const tb = typeStr(b);
    if (ta !== tb) return ta < tb;
    return limit(SAME_TYPE_ID);
  }
}

// ─── list.sort ──────────────────────────────────────────────

function reverse(a, lo, hi) {
  for (hi -= 1; lo < hi; lo++, hi--) {
    const t = a[lo];
    a[lo] = a[hi];
    a[hi] = t;
  }
}

// count_run (Objects/listobject.c, 3.13): the run starting at lo, made
// ascending in place; returns its length
function countRun(a, nremaining, lt) {
  let n;
  for (n = 1; n < nremaining; ++n) {
    if (lt(a[n], a[n - 1])) break;
  }
  if (n === nremaining) return n;
  if (n > 1) {
    if (lt(a[0], a[n - 1])) return n;
    reverse(a, 0, n);
  }
  ++n;
  let neq = 0;
  const reverseLastNeq = () => {
    if (neq) {
      ++neq;
      reverse(a, n - neq, n);
      neq = 0;
    }
  };
  for (; n < nremaining; ++n) {
    if (lt(a[n], a[n - 1])) reverseLastNeq();
    else if (lt(a[n - 1], a[n])) break;
    else ++neq;
  }
  reverseLastNeq();
  reverse(a, 0, n);
  for (; n < nremaining; ++n) {
    if (lt(a[n], a[n - 1])) break;
  }
  return n;
}

// binarysort: a[0:ok] is sorted; insert the rest one by one
function binarySort(a, n, ok, lt) {
  if (ok === 0) ok = 1;
  for (; ok < n; ++ok) {
    let lo = 0;
    let hi = ok;
    const pivot = a[ok];
    do {
      const mid = (lo + hi) >> 1;
      if (lt(pivot, a[mid])) hi = mid;
      else lo = mid + 1;
    } while (lo < hi);
    for (let m = ok; m > lo; --m) a[m] = a[m - 1];
    a[lo] = pivot;
  }
}

// list.sort for under 64 items (minrun == n): one run, extended by
// binary insertion — exactly CPython's comparisons
export function smallSort(items, lt) {
  const a = items.slice();
  if (a.length < 2) return a;
  if (a.length >= 64) throw new Error('smallSort: 64 items or more');
  const run = countRun(a, a.length, lt);
  if (run < a.length) binarySort(a, a.length, run, lt);
  return a;
}

// Is safeLt a strict total order on these values? Then every correct sort
// gives the same result, whatever the input order.
function totalOrder(values) {
  const has = (pred) => values.some(pred);
  if (has((v) => v === true || v === false) && has((v) => v instanceof PyBytes)
    && has((v) => typeof v === 'bigint' || v instanceof PyFloat)) return false;
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      const a = values[i];
      const b = values[j];
      if (typeStr(a) !== typeStr(b)) continue;
      try { pyLt(a, b); pyLt(b, a); } catch (e) { if (e === TYPE_ERROR) return false; throw e; }
    }
  }
  return true;
}

// sorted(items, key=_safe_key) — `key` picks the compared value from an
// item. orderKnown: the input order is CPython's (a dict's insertion
// order, a set without randomized hashes).
export function safeSorted(items, orderKnown, key = (x) => x) {
  const lt = (a, b) => safeLt(key(a), key(b));
  if (items.length < 64 && orderKnown) return smallSort(items, lt);
  if (items.length > 5000) limit('the demo sorts up to 5000 items');
  if (!totalOrder(items.map(key))) {
    limit(orderKnown
      ? "these items have no consistent order under pprint's sort, so the result depends on every step of CPython's timsort — the demo reproduces that for up to 63 items"
      : "these items have no consistent order under pprint's sort, and their starting order is the hash order, which changes from run to run");
  }
  return items.slice().sort((a, b) => (lt(a, b) ? -1 : lt(b, a) ? 1 : 0));
}

// object.items(), sorted with key=_safe_tuple when sort_dicts: the keys
// decide (values are never compared — two _safe_key wrappers are never ==)
function dictItems(d, sort) {
  const pairs = d.keys.map((k, i) => [k, d.vals[i]]);
  return sort ? safeSorted(pairs, true, (p) => p[0]) : pairs;
}

// ─── str helpers ────────────────────────────────────────────

// str.splitlines(keepends=True)
const LINE_BREAK = new Set(['\n', '\r', '\x0b', '\x0c', '\x1c', '\x1d', '\x1e', '\x85', '\u2028', '\u2029']);
function splitlinesKeep(s) {
  const out = [];
  let start = 0;
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (LINE_BREAK.has(c)) {
      const end = c === '\r' && s[i + 1] === '\n' ? i + 2 : i + 1;
      out.push(s.slice(start, end));
      start = i = end;
    } else i++;
  }
  if (start < s.length) out.push(s.slice(start));
  return out;
}
// str.isspace() for one character (Unicode 15.1)
const isPySpace = (c) => /^[\t\n\x0b\x0c\r\x1c-\x1f \x85\xa0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]$/.test(c);
// re.findall(r'\S*\s*', line) minus the final empty match
function wordParts(line) {
  const parts = [];
  let i = 0;
  while (i < line.length) {
    let j = i;
    while (j < line.length && !isPySpace(line[j])) j++;
    while (j < line.length && isPySpace(line[j])) j++;
    parts.push(line.slice(i, j));
    i = j;
  }
  return parts;
}

// ─── PrettyPrinter ──────────────────────────────────────────

// int(x) for the int-like options a demo passes (JS number / bigint / bool)
function intOpt(x, name) {
  if (typeof x === 'bigint') return Number(x);
  if (typeof x === 'number') return Number.isFinite(x) ? Math.trunc(x) : raise('OverflowError', 'cannot convert float infinity to integer');
  if (x === true || x === false) return x ? 1 : 0;
  return raise('TypeError', `int() argument must be a string, a bytes-like object or a real number, not '${typeName(x)}' (${name})`);
}

class Stream {
  constructor() { this.parts = []; this.size = 0; }
  write(s) {
    this.size += s.length;
    if (this.size > MAX_OUTPUT) limit(`the demo stops at ${MAX_OUTPUT} characters of output`);
    this.parts.push(s);
  }
  value() { return this.parts.join(''); }
}

export class PrettyPrinter {
  constructor({ indent = 1, width = 80, depth = null, compact = false, sortDicts = true, underscoreNumbers = false } = {}) {
    const ind = intOpt(indent, 'indent');
    const wid = intOpt(width, 'width');
    if (ind < 0) raise('ValueError', 'indent must be >= 0');
    if (depth !== null && depth <= 0) raise('ValueError', 'depth must be > 0');
    if (!wid) raise('ValueError', 'width must be != 0');
    this._depth = depth;
    this._indentPerLevel = ind;
    this._width = wid;
    this._compact = Boolean(compact);
    this._sortDicts = sortDicts;
    this._underscoreNumbers = underscoreNumbers;
  }

  // the text pprint() writes (with its newline) / pformat() returns —
  // markers still inside; pass it through shown() before displaying
  pprintText(object) { return this.pformatRaw(object) + '\n'; }

  pformatRaw(object) {
    const stream = new Stream();
    this._format(object, stream, 0, 0, new Set(), 0);
    return stream.value();
  }

  isrecursive(object) { return this._flags(object)[2]; }

  isreadable(object) {
    const [, readable, recursive] = this._flags(object);
    return readable && !recursive;
  }

  // self.format(object, {}, 0, 0). The two flags do not depend on the order
  // of dict items, so the keys are not sorted here: CPython's sort never
  // fails (_safe_key), but an order that hangs on id() would stop the demo.
  _flags(object) {
    const sort = this._sortDicts;
    this._sortDicts = false;
    try {
      return this.format(object, new Set(), 0, 0);
    } finally {
      this._sortDicts = sort;
    }
  }

  _format(object, stream, indent, allowance, context, level) {
    if (context.has(object)) {
      stream.write(recursionText(object));
      this._recursive = true;
      this._readable = false;
      return;
    }
    const rep = this._repr(object, context, level);
    const maxWidth = this._width - indent - allowance;
    if (plen(rep) > maxWidth) {
      const p = this._dispatch(object);
      if (p) {
        context.add(object);
        p.call(this, object, stream, indent, allowance, context, level + 1);
        context.delete(object);
        return;
      }
    }
    stream.write(rep);
  }

  // _dispatch[type(object).__repr__]
  _dispatch(object) {
    if (object instanceof PyDict) return this._pprintDict;
    if (object instanceof PyList) return this._pprintList;
    if (object instanceof PyTuple) return this._pprintTuple;
    if (object instanceof PySet) return this._pprintSet;
    if (object instanceof PyStr) return this._pprintStr;
    if (object instanceof PyBytes) return this._pprintBytes;
    return null;
  }

  _pprintDict(object, stream, indent, allowance, context, level) {
    stream.write('{');
    if (this._indentPerLevel > 1) stream.write(' '.repeat(this._indentPerLevel - 1));
    if (object.size) {
      this._formatDictItems(dictItems(object, this._sortDicts), stream, indent, allowance + 1, context, level);
    }
    stream.write('}');
  }

  _pprintList(object, stream, indent, allowance, context, level) {
    stream.write('[');
    this._formatItems(object.items, stream, indent, allowance + 1, context, level);
    stream.write(']');
  }

  _pprintTuple(object, stream, indent, allowance, context, level) {
    stream.write('(');
    const endchar = object.items.length === 1 ? ',)' : ')';
    this._formatItems(object.items, stream, indent, allowance + endchar.length, context, level);
    stream.write(endchar);
  }

  _pprintSet(object, stream, indent, allowance, context, level) {
    if (!object.size) {
      stream.write(rawRepr(object));
      return;
    }
    let endchar;
    if (!object.frozen) {
      stream.write('{');
      endchar = '}';
    } else {
      stream.write('frozenset({');
      endchar = '})';
      indent += 'frozenset'.length + 1;
    }
    const items = safeSorted(setItems(object), !object.random);
    this._formatItems(items, stream, indent, allowance + endchar.length, context, level);
    stream.write(endchar);
  }

  _pprintStr(object, stream, indent, allowance, context, level) {
    const text = object.v;
    if (!text.length) {
      stream.write(rawRepr(object));
      return;
    }
    const chunks = [];
    const lines = splitlinesKeep(text);
    if (level === 1) {
      indent += 1;
      allowance += 1;
    }
    let maxWidth1 = this._width - indent;
    const maxWidth = maxWidth1;
    let rep = '';
    lines.forEach((line, i) => {
      rep = pyStrRepr(line);
      if (i === lines.length - 1) maxWidth1 -= allowance;
      if (plen(rep) <= maxWidth1) chunks.push(rep);
      else {
        const parts = wordParts(line);
        let maxWidth2 = maxWidth;
        let current = '';
        parts.forEach((part, j) => {
          const candidate = current + part;
          if (j === parts.length - 1 && i === lines.length - 1) maxWidth2 -= allowance;
          if (plen(pyStrRepr(candidate)) > maxWidth2) {
            if (current) chunks.push(pyStrRepr(current));
            current = part;
          } else current = candidate;
        });
        if (current) chunks.push(pyStrRepr(current));
      }
    });
    if (chunks.length === 1) {
      stream.write(rep);
      return;
    }
    if (level === 1) stream.write('(');
    chunks.forEach((r, i) => {
      if (i > 0) stream.write('\n' + ' '.repeat(indent));
      stream.write(r);
    });
    if (level === 1) stream.write(')');
  }

  _pprintBytes(object, stream, indent, allowance, context, level) {
    const b = object.b;
    if (b.length <= 4) {
      stream.write(bytesRepr(b));
      return;
    }
    const parens = level === 1;
    if (parens) {
      indent += 1;
      allowance += 1;
      stream.write('(');
    }
    let delim = '';
    for (const rep of wrapBytesRepr(b, this._width - indent, allowance)) {
      stream.write(delim);
      stream.write(rep);
      if (!delim) delim = '\n' + ' '.repeat(indent);
    }
    if (parens) stream.write(')');
  }

  _formatDictItems(items, stream, indent, allowance, context, level) {
    indent += this._indentPerLevel;
    const delimnl = ',\n' + ' '.repeat(indent);
    const lastIndex = items.length - 1;
    items.forEach(([key, ent], i) => {
      const last = i === lastIndex;
      const rep = this._repr(key, context, level);
      stream.write(rep);
      stream.write(': ');
      this._format(ent, stream, indent + plen(rep) + 2, last ? allowance : 1, context, level);
      if (!last) stream.write(delimnl);
    });
  }

  _formatItems(items, stream, indent, allowance, context, level) {
    indent += this._indentPerLevel;
    if (this._indentPerLevel > 1) stream.write(' '.repeat(this._indentPerLevel - 1));
    const delimnl = ',\n' + ' '.repeat(indent);
    let delim = '';
    let width = this._width - indent + 1;
    let maxWidth = width;
    for (let i = 0; i < items.length; i++) {
      const ent = items[i];
      const last = i === items.length - 1;
      if (last) {
        maxWidth -= allowance;
        width -= allowance;
      }
      if (this._compact) {
        const rep = this._repr(ent, context, level);
        const w = plen(rep) + 2;
        if (width < w) {
          width = maxWidth;
          if (delim) delim = delimnl;
        }
        if (width >= w) {
          width -= w;
          stream.write(delim);
          delim = ', ';
          stream.write(rep);
          continue;
        }
      }
      stream.write(delim);
      delim = delimnl;
      this._format(ent, stream, indent, last ? allowance : 1, context, level);
    }
  }

  _repr(object, context, level) {
    const [repr, readable, recursive] = this.format(object, new Set(context), this._depth, level);
    if (!readable) this._readable = false;
    if (recursive) this._recursive = true;
    return repr;
  }

  // the hook subclasses override: (repr text, readable, recursive)
  format(object, context, maxlevels, level) {
    return this._safeRepr(object, context, maxlevels, level);
  }

  _safeRepr(object, context, maxlevels, level) {
    if (object === null || object === true || object === false
      || object instanceof PyStr || object instanceof PyBytes || object instanceof PyFloat) {
      return [rawRepr(object), true, false];
    }
    if (typeof object === 'bigint') {
      return [this._underscoreNumbers ? underscored(object) : intRepr(object), true, false];
    }
    const limited = maxlevels !== null && maxlevels !== 0 && level >= maxlevels;
    if (object instanceof PyDict) {
      if (!object.size) return ['{}', true, false];
      if (limited) return ['{...}', false, context.has(object)];
      if (context.has(object)) return [recursionText(object), false, true];
      context.add(object);
      let readable = true;
      let recursive = false;
      const components = [];
      const inner = level + 1;
      for (const [k, v] of dictItems(object, this._sortDicts)) {
        const [krepr, kreadable, krecur] = this.format(k, context, maxlevels, inner);
        const [vrepr, vreadable, vrecur] = this.format(v, context, maxlevels, inner);
        components.push(`${krepr}: ${vrepr}`);
        readable = readable && kreadable && vreadable;
        if (krecur || vrecur) recursive = true;
      }
      context.delete(object);
      return ['{' + components.join(', ') + '}', readable, recursive];
    }
    if (object instanceof PyList || object instanceof PyTuple) {
      let fmt;
      const n = object.items.length;
      if (object instanceof PyList) {
        if (!n) return ['[]', true, false];
        fmt = (s) => `[${s}]`;
      } else if (n === 1) fmt = (s) => `(${s},)`;
      else {
        if (!n) return ['()', true, false];
        fmt = (s) => `(${s})`;
      }
      if (limited) return [fmt('...'), false, context.has(object)];
      if (context.has(object)) return [recursionText(object), false, true];
      context.add(object);
      let readable = true;
      let recursive = false;
      const components = [];
      const inner = level + 1;
      for (const o of object.items) {
        const [orepr, oreadable, orecur] = this.format(o, context, maxlevels, inner);
        components.push(orepr);
        if (!oreadable) readable = false;
        if (orecur) recursive = true;
      }
      context.delete(object);
      return [fmt(components.join(', ')), readable, recursive];
    }
    const rep = rawRepr(object);
    return [rep, rep.length > 0 && !rep.startsWith('<'), false];
  }
}

// _wrap_bytes_repr
function* wrapBytesRepr(b, width, allowance) {
  let current = new Uint8Array(0);
  const last = Math.floor(b.length / 4) * 4;
  for (let i = 0; i < b.length; i += 4) {
    const part = b.subarray(i, i + 4);
    const candidate = new Uint8Array(current.length + part.length);
    candidate.set(current);
    candidate.set(part, current.length);
    if (i === last) width -= allowance;
    if (bytesRepr(candidate).length > width) {
      if (current.length) yield bytesRepr(current);
      current = part;
    } else current = candidate;
  }
  if (current.length) yield bytesRepr(current);
}

// ─── module-level functions ────────────────────────────────

// keyword options in Python spelling → constructor options
const opts = (o = {}) => ({
  indent: o.indent ?? 1,
  width: o.width ?? 80,
  depth: o.depth ?? null,
  compact: o.compact ?? false,
  sortDicts: o.sort_dicts ?? true,
  underscoreNumbers: o.underscore_numbers ?? false,
});

export const pformat = (object, o) => shown(new PrettyPrinter(opts(o)).pformatRaw(object));
// what pprint() / pp() write to their stream
export const pprintText = (object, o) => shown(new PrettyPrinter(opts(o)).pprintText(object));
export const ppText = (object, o = {}) => pprintText(object, { sort_dicts: false, ...o });
export const saferepr = (object) => shown(new PrettyPrinter()._safeRepr(object, new Set(), null, 0)[0]);
// (flags only: computed without sorting dict keys, see PrettyPrinter._flags)
export const isreadable = (object) => new PrettyPrinter({ sortDicts: false })._safeRepr(object, new Set(), null, 0)[1];
export const isrecursive = (object) => new PrettyPrinter({ sortDicts: false })._safeRepr(object, new Set(), null, 0)[2];
