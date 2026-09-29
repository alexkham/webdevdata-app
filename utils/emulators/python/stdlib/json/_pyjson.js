// utils/emulators/python/stdlib/json/_pyjson.js
//
// Line-by-line port of CPython 3.13's json module (Lib/json/decoder.py,
// scanner.py, encoder.py) for the json demos — shared by the json module
// hub and member emulators. Not a content page (leading underscore), so the
// catalog generator never maps it.
//
// Python value model:
//   None → null · bool → true/false · int → bigint · float → PyFloat
//   str → string · list → Array · tuple → { __pyTuple: [...] }
//   dict → PyDict (insertion-ordered, Python key equality: 1 == 1.0 == True)
//   anything else → { __pyType: 'set' } (for "not JSON serializable")
// pyValRepr() renders repr() exactly (str via pyStrRepr).

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

export class PyFloat {
  constructor(v) { this.v = v; }
}
export const pyFloat = (v) => new PyFloat(v);

export class PyDict {
  constructor(entries = []) {
    this.entries = [];
    for (const [k, v] of entries) this.set(k, v);
  }
  indexOf(k) {
    return this.entries.findIndex(([kk]) => keyEq(kk, k));
  }
  set(k, v) {
    const i = this.indexOf(k);
    if (i === -1) this.entries.push([k, v]);
    else this.entries[i] = [this.entries[i][0], v]; // first key object kept, value replaced
  }
  get size() { return this.entries.length; }
}

// numeric value of an int/float/bool key, else null
const numOf = (k) => {
  if (typeof k === 'bigint') return { big: k };
  if (typeof k === 'boolean') return { big: k ? 1n : 0n };
  if (k instanceof PyFloat) return { f: k.v };
  return null;
};
function keyEq(a, b) {
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  if (a === null || b === null) return a === b;
  const x = numOf(a);
  const y = numOf(b);
  if (!x || !y) return a === b;
  if (x.big !== undefined && y.big !== undefined) return x.big === y.big;
  const fx = x.f !== undefined ? x.f : null;
  const fy = y.f !== undefined ? y.f : null;
  if (fx !== null && fy !== null) return fx === fy;
  const f = fx !== null ? fx : fy;
  const big = fx !== null ? y.big : x.big;
  return Number.isInteger(f) && BigInt(f) === big;
}

// depth = number of enclosing containers; repr of a container nested
// deeper than MAX_REPR_NESTING raises like CPython's repr. Iterative
// (explicit stack), so the JS stack never limits how deep a value can be.
export function pyValRepr(root, depth0 = 0) {
  const scalar = (v) => {
    if (v === null || v === undefined) return 'None';
    if (v === true) return 'True';
    if (v === false) return 'False';
    if (typeof v === 'bigint') return String(v);
    if (v instanceof PyFloat) return pyFloatRepr(v.v);
    if (typeof v === 'string') return pyStrRepr(v);
    if (v.__pyRaw !== undefined) return v.__pyRaw;
    if (Array.isArray(v) || v instanceof PyDict || v.__pyTuple) return null; // a container
    return String(v);
  };
  const open = (v, depth) => {
    if (depth > MAX_REPR_NESTING) {
      throw new PyException('RecursionError', 'maximum recursion depth exceeded while getting the repr of an object');
    }
    if (v instanceof PyDict) {
      // flatten to key, value, key, value … ; keys are always scalars here
      return { kind: 'dict', seq: v.entries.flat(), i: 0, parts: [], depth };
    }
    return { kind: Array.isArray(v) ? 'list' : 'tuple', seq: Array.isArray(v) ? v : v.__pyTuple, i: 0, parts: [], depth };
  };
  const close = (f) => {
    if (f.kind === 'dict') {
      const items = [];
      for (let k = 0; k < f.parts.length; k += 2) items.push(`${f.parts[k]}: ${f.parts[k + 1]}`);
      return '{' + items.join(', ') + '}';
    }
    if (f.kind === 'list') return '[' + f.parts.join(', ') + ']';
    return '(' + f.parts.join(', ') + (f.parts.length === 1 ? ',' : '') + ')';
  };

  const first = scalar(root);
  if (first !== null) return first;
  const stack = [open(root, depth0 + 1)];
  for (;;) {
    const top = stack[stack.length - 1];
    if (top.i < top.seq.length) {
      const v = top.seq[top.i];
      top.i += 1;
      const s = scalar(v);
      if (s !== null) top.parts.push(s);
      else stack.push(open(v, top.depth + 1));
      continue;
    }
    const text = close(stack.pop());
    if (stack.length === 0) return text;
    stack[stack.length - 1].parts.push(text);
  }
}
// wrap for pyRepr/pyReprExact consumers
export const asPy = (v) => ({ __pyRaw: pyValRepr(v) });

// ─── decoder ────────────────────────────────────────────────

export class JSONDecodeError extends PyException {
  constructor(msg, doc, pos) {
    // doc is the code-point array; rfind('\n', 0, pos) searches [0, pos)
    const lineno = countNewlines(doc, pos) + 1;
    let nl = -1;
    for (let i = Math.min(pos, doc.length) - 1; i >= 0; i--) if (doc[i] === '\n') { nl = i; break; }
    const colno = pos - nl;
    // positions are Python str indexes (code points), reported as such
    // the traceback shows the qualified name: json.decoder.JSONDecodeError
    super('json.decoder.JSONDecodeError', `${msg}: line ${lineno} column ${colno} (char ${pos})`);
    Object.assign(this, { msg, doc, pos, lineno, colno });
  }
}
function countNewlines(doc, pos) {
  let n = 0;
  for (let i = 0; i < pos && i < doc.length; i++) if (doc[i] === '\n') n += 1;
  return n;
}

const WS = ' \t\n\r';
const skipWs = (s, i) => {
  while (i < s.length && WS.includes(s[i])) i += 1;
  return i;
};
const BACKSLASH = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' };

class Stop {
  constructor(value) { this.value = value; }
}

// scanstring — follows the C accelerator (Modules/_json.c,
// scanstring_unicode), which json.loads uses by default. Its messages and
// positions differ from the pure-Python py_scanstring in decoder.py.
// s is an ARRAY of code points (Python str indexing).
const HEX = /^[0-9A-Fa-f]$/;
function scanstring(s, end, strict) {
  const len = s.length;
  const chunks = [];
  const begin = end - 1;
  for (;;) {
    let next = end;
    let c = '';
    for (; next < len; next++) {
      c = s[next];
      if (c === '"' || c === '\\') break;
      if (strict && c.codePointAt(0) <= 0x1f) throw new JSONDecodeError('Invalid control character at', s, next);
    }
    if (next >= len) throw new JSONDecodeError('Unterminated string starting at', s, begin);
    if (next > end) chunks.push(s.slice(end, next).join(''));
    next += 1;
    if (c === '"') { end = next; break; }
    if (next === len) throw new JSONDecodeError('Unterminated string starting at', s, begin);
    c = s[next];
    let ch;
    if (c !== 'u') {
      end = next + 1;
      if (!Object.prototype.hasOwnProperty.call(BACKSLASH, c)) {
        throw new JSONDecodeError('Invalid \\escape', s, end - 2);
      }
      ch = BACKSLASH[c];
    } else {
      next += 1;
      end = next + 4;
      if (end >= len) throw new JSONDecodeError('Invalid \\uXXXX escape', s, next - 1);
      let code = 0;
      for (; next < end; next++) {
        if (!HEX.test(s[next])) throw new JSONDecodeError('Invalid \\uXXXX escape', s, end - 5);
        code = (code << 4) | parseInt(s[next], 16);
      }
      // surrogate pair: needs room for \uXXXX plus at least one more char
      if (code >= 0xd800 && code <= 0xdbff && end + 6 < len && s[next] === '\\' && s[next + 1] === 'u') {
        next += 2;
        end += 6;
        let c2 = 0;
        for (; next < end; next++) {
          if (!HEX.test(s[next])) throw new JSONDecodeError('Invalid \\uXXXX escape', s, end - 5);
          c2 = (c2 << 4) | parseInt(s[next], 16);
        }
        if (c2 >= 0xdc00 && c2 <= 0xdfff) code = 0x10000 + (((code - 0xd800) << 10) | (c2 - 0xdc00));
        else end -= 6;
      }
      ch = String.fromCodePoint(code);
    }
    chunks.push(ch);
  }
  return [chunks.join(''), end];
}

const INT_MAX_STR_DIGITS = 4300;
function parseInt10(text) {
  const digits = text.replace('-', '').length;
  if (digits > INT_MAX_STR_DIGITS) {
    throw new PyException('ValueError', `Exceeds the limit (${INT_MAX_STR_DIGITS} digits) for integer string conversion: value has ${digits} digits; use sys.set_int_max_str_digits() to increase the limit`);
  }
  return BigInt(text);
}

// Nesting limits. CPython's C scanner (and repr) guard each level with
// Py_EnterRecursiveCall — the C recursion limit, a BUILD setting, not
// sys.getrecursionlimit(). Measured on CPython 3.13.3 (Windows x64) inside
// a demo snippet: json.loads parses 2996 levels and raises at 2997; repr()
// of a 2996-deep list/dict raises. The exact cutoff shifts by a level or
// two with the caller's own stack depth (REPL vs script) and by build.
export const MAX_NESTING = 2996;
export const MAX_REPR_NESTING = 2996; // >= MAX_NESTING: the demo shows repr() of any loadable value
const nestingError = (kind) =>
  new PyException('RecursionError', `maximum recursion depth exceeded while decoding a JSON ${kind} from a unicode string`);

// One JS frame budget per level is scanValue → scanOnce → parseX (3 frames),
// so V8's default stack comfortably covers MAX_NESTING. If an engine's stack
// is smaller anyway, loads/rawDecode report the RangeError the way CPython
// reports running out of depth (see guardDepth).
// scalar values only (strings, literals, numbers); containers are handled
// by parseValue's explicit stack
function makeScanner(strict) {
  const scanOnce = (s, idx) => {
    if (idx >= s.length) throw new Stop(idx);
    const c = s[idx];
    const at = (n) => s.slice(idx, idx + n).join('');
    if (c === '"') return scanstring(s, idx + 1, strict);
    if (c === 'n' && at(4) === 'null') return [null, idx + 4];
    if (c === 't' && at(4) === 'true') return [true, idx + 4];
    if (c === 'f' && at(5) === 'false') return [false, idx + 5];
    // NUMBER_RE: (-?(?:0|[1-9][0-9]*))(\.[0-9]+)?([eE][-+]?[0-9]+)?
    const rest = s.slice(idx, idx + 20000).join('');
    const m = /^(-?(?:0|[1-9][0-9]*))(\.[0-9]+)?([eE][-+]?[0-9]+)?/.exec(rest);
    if (m) {
      const [whole, integer, frac, exp] = m;
      const res = frac || exp ? pyFloat(Number(integer + (frac || '') + (exp || ''))) : parseInt10(integer);
      return [res, idx + whole.length];
    }
    if (c === 'N' && at(3) === 'NaN') return [pyFloat(NaN), idx + 3];
    if (c === 'I' && at(8) === 'Infinity') return [pyFloat(Infinity), idx + 8];
    if (c === '-' && at(9) === '-Infinity') return [pyFloat(-Infinity), idx + 9];
    throw new Stop(idx);
  };
  return scanOnce;
}

// parseValue — iterative (explicit stack) port of the C accelerator's
// scan_once / _parse_object_unicode / _parse_array_unicode, so nesting
// depth is limited by MAX_NESTING (as in CPython), not by the JS stack.
// Error messages, positions and their order follow _json.c exactly.
const isWs = (s, i) => i < s.length && WS.includes(s[i]);

function parseValue(s, idx, strict, scanScalar, state) {
  const stack = []; // { kind: 'array' | 'object', items: [], key }
  const skip = () => { while (isWs(s, idx)) idx += 1; };

  // read the key and ':' of the next object member; leaves idx at the value
  const readKey = (frame) => {
    if (idx >= s.length || s[idx] !== '"') {
      throw new JSONDecodeError('Expecting property name enclosed in double quotes', s, idx);
    }
    let key;
    [key, idx] = scanstring(s, idx + 1, strict);
    skip();
    if (idx >= s.length || s[idx] !== ':') throw new JSONDecodeError("Expecting ':' delimiter", s, idx);
    idx += 1;
    skip();
    frame.key = key;
  };

  for (;;) {
    // ── want a value at idx ──
    let value;
    let have = false;
    while (!have) {
      if (idx >= s.length) throw new JSONDecodeError('Expecting value', s, idx);
      const c = s[idx];
      if (c === '{' || c === '[') {
        const kind = c === '{' ? 'object' : 'array';
        state.kind = kind;
        if (stack.length + 1 > MAX_NESTING) throw nestingError(kind);
        const frame = { kind, items: [], key: null };
        stack.push(frame);
        idx += 1;
        skip();
        const close = kind === 'object' ? '}' : ']';
        if (idx < s.length && s[idx] === close) {
          stack.pop();
          idx += 1;
          value = kind === 'object' ? new PyDict() : [];
          have = true;
        } else if (kind === 'object') {
          readKey(frame);
        }
        continue; // an array element (or member value) starts at idx
      }
      try {
        [value, idx] = scanScalar(s, idx);
      } catch (e) {
        if (e instanceof Stop) throw new JSONDecodeError('Expecting value', s, e.value);
        throw e;
      }
      have = true;
    }

    // ── a value is complete: attach it to the innermost container ──
    for (;;) {
      if (stack.length === 0) return [value, idx];
      const top = stack[stack.length - 1];
      if (top.kind === 'object') top.items.push([top.key, value]);
      else top.items.push(value);
      skip();
      const close = top.kind === 'object' ? '}' : ']';
      if (idx < s.length && s[idx] === close) {
        stack.pop();
        idx += 1;
        value = top.kind === 'object' ? new PyDict(top.items) : top.items;
        continue; // the finished container is itself a value one level up
      }
      if (idx >= s.length || s[idx] !== ',') throw new JSONDecodeError("Expecting ',' delimiter", s, idx);
      const commaIdx = idx;
      idx += 1;
      skip();
      if (idx < s.length && s[idx] === close) {
        throw new JSONDecodeError(`Illegal trailing comma before end of ${top.kind}`, s, commaIdx);
      }
      if (top.kind === 'object') readKey(top);
      break; // next element / member value starts at idx
    }
  }
}

// An engine whose stack is smaller than MAX_NESTING needs: report the
// overflow as CPython reports running out of nesting depth.
function guardDepth(state, fn) {
  try {
    return fn();
  } catch (e) {
    if (e instanceof RangeError) throw nestingError(state.kind);
    throw e;
  }
}

// json.loads(text) for a str argument
export function loads(text, { strict = true } = {}) {
  const s = [...text]; // Python indexes by code point
  if (s[0] === '﻿') throw new JSONDecodeError('Unexpected UTF-8 BOM (decode using utf-8-sig)', s, 0);
  const state = { kind: 'array' };
  const [obj, end0] = guardDepth(state, () => parseValue(s, skipWs(s, 0), strict, makeScanner(strict), state));
  const end = skipWs(s, end0);
  if (end !== s.length) throw new JSONDecodeError('Extra data', s, end);
  return obj;
}

// JSONDecoder().raw_decode(text, idx) → (obj, end). No whitespace skipping
// (CPython doesn't either: ' 1' fails at char 0). `end` is a str index.
export function rawDecode(text, idx = 0, { strict = true } = {}) {
  const s = [...text];
  if (idx < 0) throw new PyException('ValueError', 'idx cannot be negative');
  const state = { kind: 'array' };
  const [obj, end] = guardDepth(state, () => parseValue(s, idx, strict, makeScanner(strict), state));
  return [obj, end];
}

// ─── encoder ────────────────────────────────────────────────

const ESCAPE_DCT = { '\\': '\\\\', '"': '\\"', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t' };
const hex4 = (n) => n.toString(16).padStart(4, '0');

function encodeStr(str, ensureAscii) {
  let out = '"';
  for (const ch of str) {
    const n = ch.codePointAt(0);
    if (ESCAPE_DCT[ch]) out += ESCAPE_DCT[ch];
    else if (n < 0x20) out += '\\u' + hex4(n);
    else if (ensureAscii && (n < 0x20 || n > 0x7e)) {
      if (n < 0x10000) out += '\\u' + hex4(n);
      else {
        const m = n - 0x10000;
        out += '\\u' + hex4(0xd800 | ((m >> 10) & 0x3ff)) + '\\u' + hex4(0xdc00 | (m & 0x3ff));
      }
    } else out += ch;
  }
  return out + '"';
}

function floatStr(f, allowNan) {
  let text;
  if (Number.isNaN(f)) text = 'NaN';
  else if (f === Infinity) text = 'Infinity';
  else if (f === -Infinity) text = '-Infinity';
  else return pyFloatRepr(f);
  if (!allowNan) throw new PyException('ValueError', `Out of range float values are not JSON compliant: ${pyFloatRepr(f)}`);
  return text;
}

const typeName = (v) => {
  if (v === null) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (v instanceof PyFloat) return 'float';
  if (typeof v === 'string') return 'str';
  if (Array.isArray(v)) return 'list';
  if (v instanceof PyDict) return 'dict';
  if (v.__pyTuple) return 'tuple';
  return v.__pyType || 'object';
};

// ─── Python comparisons + CPython's list.sort (for sort_keys) ─────────
// sorted(dct.items()) compares (key, value) tuples; keys of one dict are
// never ==, so every comparison is `key_a < key_b`. The TypeError for
// mixed key types names (type(left), type(right)) in the order the sort
// compares them — so the sort algorithm itself must match CPython's.

const isNumeric = (t) => t === 'int' || t === 'float' || t === 'bool';
const numVal = (v) => {
  const n = numOf(v);
  return n.f !== undefined ? { f: n.f } : { big: n.big };
};
function numCmp(a, b) {
  const x = numVal(a);
  const y = numVal(b);
  if (x.big !== undefined && y.big !== undefined) return x.big < y.big ? -1 : x.big > y.big ? 1 : 0;
  const fx = x.f !== undefined ? x.f : Number(x.big);
  const fy = y.f !== undefined ? y.f : Number(y.big);
  if (Number.isNaN(fx) || Number.isNaN(fy)) return NaN;
  return fx < fy ? -1 : fx > fy ? 1 : 0;
}
function pyEq(a, b) {
  const ta = typeName(a);
  const tb = typeName(b);
  if (isNumeric(ta) && isNumeric(tb)) return numCmp(a, b) === 0;
  if (ta !== tb) return false;
  if (ta === 'str') return a === b;
  if (ta === 'NoneType') return true;
  if (ta === 'tuple') {
    const x = a.__pyTuple;
    const y = b.__pyTuple;
    return x.length === y.length && x.every((v, i) => pyEq(v, y[i]));
  }
  return a === b;
}
function pyLt(a, b) {
  const ta = typeName(a);
  const tb = typeName(b);
  if (ta === 'str' && tb === 'str') {
    const x = [...a];
    const y = [...b];
    for (let i = 0; i < Math.min(x.length, y.length); i++) {
      if (x[i] !== y[i]) return x[i].codePointAt(0) < y[i].codePointAt(0);
    }
    return x.length < y.length;
  }
  if (isNumeric(ta) && isNumeric(tb)) return numCmp(a, b) === -1;
  if (ta === 'tuple' && tb === 'tuple') {
    const x = a.__pyTuple;
    const y = b.__pyTuple;
    let i = 0;
    while (i < x.length && i < y.length && pyEq(x[i], y[i])) i += 1;
    if (i >= x.length || i >= y.length) return x.length < y.length;
    return pyLt(x[i], y[i]);
  }
  throw new PyException('TypeError', `'<' not supported between instances of '${ta}' and '${tb}'`);
}

// CPython 3.13 Objects/listobject.c for n < 64 (one run: count_run, then
// binary insertion up to n). Demo dicts never reach 64 keys.
function pySort(arr, lt) {
  const a = [...arr];
  const n0 = a.length;
  if (n0 < 2) return a;
  const rev = (lo, hi) => { // reverse a[lo:hi]
    for (let i = lo, j = hi - 1; i < j; i++, j--) [a[i], a[j]] = [a[j], a[i]];
  };
  // count_run
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
  // binarysort(a, n0, ok = n)
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

export function dumps(obj, { indent = null, sortKeys = false, ensureAscii = true, allowNan = true, separators = null, skipkeys = false } = {}) {
  const ind = indent === null ? null : typeof indent === 'string' ? indent : ' '.repeat(Math.max(0, Number(indent)));
  let itemSep;
  let keySep;
  if (separators) [itemSep, keySep] = separators;
  else if (indent !== null) [itemSep, keySep] = [',', ': '];
  else [itemSep, keySep] = [', ', ': '];
  const enc = (s) => encodeStr(s, ensureAscii);
  const markers = new Set();

  const scalar = (v) => {
    if (typeof v === 'string') return enc(v);
    if (v === null) return 'null';
    if (v === true) return 'true';
    if (v === false) return 'false';
    if (typeof v === 'bigint') return String(v);
    if (v instanceof PyFloat) return floatStr(v.v, allowNan);
    return undefined;
  };

  // Iterative (explicit stack) so the JS stack never limits depth; chunks
  // and errors come out in exactly the order of the recursive original.
  const circular = () => new PyException('ValueError', 'Circular reference detected');
  const chunks = [];
  const stack = []; // { kind, marker, items, i, level, sep, nl, first }

  const emitValue = (v, level) => {
    const s = scalar(v);
    if (s !== undefined) { chunks.push(s); return; }
    const lst = Array.isArray(v) ? v : v && v.__pyTuple ? v.__pyTuple : null;
    const isDict = v instanceof PyDict;
    if (!lst && !isDict) throw new PyException('TypeError', `Object of type ${typeName(v)} is not JSON serializable`);
    if (lst ? lst.length === 0 : v.size === 0) { chunks.push(lst ? '[]' : '{}'); return; }
    const marker = lst || v;
    if (markers.has(marker)) throw circular();
    markers.add(marker);
    chunks.push(lst ? '[' : '{');
    let lvl = level;
    let sep = itemSep;
    let nl = null;
    if (ind !== null) {
      lvl += 1;
      nl = '\n' + ind.repeat(lvl);
      sep = itemSep + nl;
      chunks.push(nl);
    }
    let items = lst || v.entries;
    if (isDict && sortKeys) items = pySort(items, (p, q) => pyLt(p[0], q[0]));
    stack.push({ kind: lst ? 'list' : 'dict', marker, items, i: 0, level: lvl, sep, nl, first: true });
  };

  emitValue(obj, 0);
  while (stack.length > 0) {
    const f = stack[stack.length - 1];
    if (f.i < f.items.length) {
      if (f.kind === 'list') {
        if (f.i > 0) chunks.push(f.sep);
        const v = f.items[f.i];
        f.i += 1;
        emitValue(v, f.level);
        continue;
      }
      let [k, v] = f.items[f.i];
      f.i += 1;
      if (typeof k === 'string') { /* as is */ }
      else if (k instanceof PyFloat) k = floatStr(k.v, allowNan);
      else if (k === true) k = 'true';
      else if (k === false) k = 'false';
      else if (k === null) k = 'null';
      else if (typeof k === 'bigint') k = String(k);
      else if (skipkeys) continue;
      else throw new PyException('TypeError', `keys must be str, int, float, bool or None, not ${typeName(k)}`);
      if (!f.first) chunks.push(f.sep);
      f.first = false;
      chunks.push(enc(k) + keySep);
      emitValue(v, f.level);
      continue;
    }
    if (f.nl !== null) chunks.push('\n' + ind.repeat(f.level - 1));
    chunks.push(f.kind === 'list' ? ']' : '}');
    markers.delete(f.marker);
    stack.pop();
  }
  return chunks.join('');
}

// ─── iterencode (pure-Python encoder) ──────────────────────
// Port of Lib/json/encoder.py _make_iterencode — what
// JSONEncoder.iterencode() and json.dump() run (dump never uses the C
// encoder). A generator, so the chunks match CPython's list(iterencode())
// one for one, and a consumer that writes chunks as they come (json.dump)
// keeps exactly the partial output CPython leaves behind on an error.
// Extra option: `default` — a JS function Python value → Python value
// (throw a PyException to raise), like default= / JSONEncoder.default.
// ''.join(chunks) equals dumps() for the same options.
export function* iterencode(obj, {
  indent = null, sortKeys = false, ensureAscii = true, allowNan = true,
  separators = null, skipkeys = false, checkCircular = true, default: dflt = null,
} = {}) {
  const ind = indent === null ? null : typeof indent === 'string' ? indent : ' '.repeat(Math.max(0, Number(indent)));
  let itemSep;
  let keySep;
  if (separators) [itemSep, keySep] = separators;
  else if (indent !== null) [itemSep, keySep] = [',', ': '];
  else [itemSep, keySep] = [', ', ': '];
  const enc = (s) => encodeStr(s, ensureAscii);
  const markers = checkCircular ? new Set() : null;
  const circular = () => new PyException('ValueError', 'Circular reference detected');
  const defaultFn = dflt || ((o) => {
    throw new PyException('TypeError', `Object of type ${typeName(o)} is not JSON serializable`);
  });

  // str, None, True, False, int, float — in _make_iterencode's order
  const scalar = (v) => {
    if (typeof v === 'string') return enc(v);
    if (v === null) return 'null';
    if (v === true) return 'true';
    if (v === false) return 'false';
    if (typeof v === 'bigint') return String(v);
    if (v instanceof PyFloat) return floatStr(v.v, allowNan);
    return undefined;
  };
  const listOf = (v) => (Array.isArray(v) ? v : v && v.__pyTuple ? v.__pyTuple : null);

  function* iterList(lst, level) {
    if (lst.length === 0) { yield '[]'; return; }
    if (markers) {
      if (markers.has(lst)) throw circular();
      markers.add(lst);
    }
    let buf = '[';
    let newlineIndent = null;
    let separator = itemSep;
    if (ind !== null) {
      level += 1;
      newlineIndent = '\n' + ind.repeat(level);
      separator = itemSep + newlineIndent;
      buf += newlineIndent;
    }
    let first = true;
    for (const value of lst) {
      if (first) first = false;
      else buf = separator;
      const s = scalar(value);
      if (s !== undefined) { yield buf + s; continue; }
      yield buf;
      const inner = listOf(value);
      if (inner) yield* iterList(inner, level);
      else if (value instanceof PyDict) yield* iterDict(value, level);
      else yield* iterAny(value, level);
    }
    if (newlineIndent !== null) {
      level -= 1;
      yield '\n' + ind.repeat(level);
    }
    yield ']';
    if (markers) markers.delete(lst);
  }

  function* iterDict(dct, level) {
    if (dct.size === 0) { yield '{}'; return; }
    if (markers) {
      if (markers.has(dct)) throw circular();
      markers.add(dct);
    }
    yield '{';
    let newlineIndent = null;
    let itemSeparator = itemSep;
    if (ind !== null) {
      level += 1;
      newlineIndent = '\n' + ind.repeat(level);
      itemSeparator = itemSep + newlineIndent;
      yield newlineIndent;
    }
    let first = true;
    const items = sortKeys ? pySort(dct.entries, (p, q) => pyLt(p[0], q[0])) : dct.entries;
    for (let [key, value] of items) {
      if (typeof key === 'string') { /* as is */ }
      else if (key instanceof PyFloat) key = floatStr(key.v, allowNan);
      else if (key === true) key = 'true';
      else if (key === false) key = 'false';
      else if (key === null) key = 'null';
      else if (typeof key === 'bigint') key = String(key);
      else if (skipkeys) continue;
      else throw new PyException('TypeError', `keys must be str, int, float, bool or None, not ${typeName(key)}`);
      if (first) first = false;
      else yield itemSeparator;
      yield enc(key);
      yield keySep;
      const s = scalar(value);
      if (s !== undefined) { yield s; continue; }
      const inner = listOf(value);
      if (inner) yield* iterList(inner, level);
      else if (value instanceof PyDict) yield* iterDict(value, level);
      else yield* iterAny(value, level);
    }
    if (newlineIndent !== null) {
      level -= 1;
      yield '\n' + ind.repeat(level);
    }
    yield '}';
    if (markers) markers.delete(dct);
  }

  function* iterAny(o, level) {
    const s = scalar(o);
    if (s !== undefined) { yield s; return; }
    const inner = listOf(o);
    if (inner) { yield* iterList(inner, level); return; }
    if (o instanceof PyDict) { yield* iterDict(o, level); return; }
    if (markers) {
      if (markers.has(o)) throw circular();
      markers.add(o);
    }
    const replacement = defaultFn(o);
    yield* iterAny(replacement, level);
    if (markers) markers.delete(o);
  }

  yield* iterAny(obj, 0);
}

// ' ' * indent, computed the way JSONEncoder.iterencode does it (before any
// output), for an indent given as a demo number already turned into a
// Python value by py-num's fromLiteral ({ int: bigint } | { float }), or a
// str, or null. Past 2**28 spaces the demo cannot build the string, so it
// reports MemoryError — CPython's result for sys.maxsize, a guess below it.
export function indentText(v) {
  if (v === null || typeof v === 'string') return v;
  if (v.float !== undefined) throw new PyException('TypeError', "can't multiply sequence by non-int of type 'float'");
  const n = v.int;
  if (n > 9223372036854775807n || n < -9223372036854775808n) {
    throw new PyException('OverflowError', "cannot fit 'int' into an index-sized integer");
  }
  if (n <= 0n) return '';
  if (n > 2n ** 28n) throw new PyException('MemoryError', '');
  return ' '.repeat(Number(n));
}
