// utils/emulators/python/exceptions/attributeerror.js
//
// Emulator for the AttributeError demo modes.
//
// Trigger: getattr() on the demo's User instance. The attribute set is
// exactly dir(u) for that class in CPython 3.13 (object's slots plus the
// two instance attributes). Bound methods print with a memory address,
// which differs on every run; those are shown with a placeholder address.
// A failed lookup gets the ". Did you mean: 'x'?" suffix that the
// traceback printer adds — a port of Python/suggestions.c (Levenshtein
// distance over UTF-8 bytes, case flips cost 1, other edits cost 2).

import { raise } from '../../../py-exceptions.js';

const ADDR = '0x7f3a1c2b4d60';
const wrapper = (n) => ({ __pyRaw: `<method-wrapper '${n}' of User object at ${ADDR}>` });
const builtin = (n) => ({ __pyRaw: `<built-in method ${n} of User object at ${ADDR}>` });
const typeMethod = (n) => ({ __pyRaw: `<built-in method ${n} of type object at ${ADDR}>` });

// dir(u) → value of getattr(u, name)
const USER = {
  __class__: { __pyRaw: "<class '__main__.User'>" },
  __delattr__: wrapper('__delattr__'),
  __dict__: { name: 'Ada', email: 'ada@example.com' },
  __dir__: builtin('__dir__'),
  __doc__: null,
  __eq__: wrapper('__eq__'),
  __firstlineno__: 1,
  __format__: builtin('__format__'),
  __ge__: wrapper('__ge__'),
  __getattribute__: wrapper('__getattribute__'),
  __getstate__: builtin('__getstate__'),
  __gt__: wrapper('__gt__'),
  __hash__: wrapper('__hash__'),
  __init__: { __pyRaw: `<bound method User.__init__ of <__main__.User object at ${ADDR}>>` },
  __init_subclass__: typeMethod('__init_subclass__'),
  __le__: wrapper('__le__'),
  __lt__: wrapper('__lt__'),
  __module__: '__main__',
  __ne__: wrapper('__ne__'),
  __new__: typeMethod('__new__'),
  __reduce__: builtin('__reduce__'),
  __reduce_ex__: builtin('__reduce_ex__'),
  __repr__: wrapper('__repr__'),
  __setattr__: wrapper('__setattr__'),
  __sizeof__: builtin('__sizeof__'),
  __static_attributes__: { __pyTuple: ['email', 'name'] },
  __str__: wrapper('__str__'),
  __subclasshook__: typeMethod('__subclasshook__'),
  __weakref__: null,
  email: 'ada@example.com',
  name: 'Ada',
};
const USER_DIR = Object.keys(USER).sort();

// ── Python/suggestions.c ─────────────────────────────────────
const MOVE_COST = 2;
const CASE_COST = 1;
const MAX_STRING_SIZE = 40;
const MAX_CANDIDATE_ITEMS = 750;
const utf8 = (s) => new TextEncoder().encode(s);

function substitutionCost(a, b) {
  if ((a & 31) !== (b & 31)) return MOVE_COST;
  if (a === b) return 0;
  const lower = (c) => (c >= 65 && c <= 90 ? c + 32 : c);
  return lower(a) === lower(b) ? CASE_COST : MOVE_COST;
}

function levenshtein(a, b, maxCost) {
  let as = 0;
  let ae = a.length;
  let bs = 0;
  let be = b.length;
  while (as < ae && bs < be && a[as] === b[bs]) { as++; bs++; }
  while (as < ae && bs < be && a[ae - 1] === b[be - 1]) { ae--; be--; }
  let A = a.subarray(as, ae);
  let B = b.subarray(bs, be);
  if (A.length === 0 || B.length === 0) return (A.length + B.length) * MOVE_COST;
  if (A.length > MAX_STRING_SIZE || B.length > MAX_STRING_SIZE) return maxCost + 1;
  if (B.length < A.length) [A, B] = [B, A];
  if ((B.length - A.length) * MOVE_COST > maxCost) return maxCost + 1;
  const buffer = [];
  for (let i = 0; i < A.length; i++) buffer[i] = (i + 1) * MOVE_COST;
  let result = 0;
  for (let bi = 0; bi < B.length; bi++) {
    const code = B[bi];
    result = bi * MOVE_COST;
    let distance = result;
    let minimum = Infinity;
    for (let i = 0; i < A.length; i++) {
      const substitute = distance + substitutionCost(code, A[i]);
      distance = buffer[i];
      const insertDelete = Math.min(result, distance) + MOVE_COST;
      result = Math.min(insertDelete, substitute);
      buffer[i] = result;
      if (result < minimum) minimum = result;
    }
    if (minimum > maxCost) return maxCost + 1;
  }
  return result;
}

function suggest(candidates, wrong) {
  // traceback: hide _private names unless the wrong name starts with '_'
  const dir = wrong[0] === '_' ? candidates : candidates.filter((x) => x[0] !== '_');
  if (dir.length >= MAX_CANDIDATE_ITEMS) return null;
  const w = utf8(wrong);
  let best = Infinity;
  let suggestion = null;
  for (const item of dir) {
    if (item === wrong) continue;
    const it = utf8(item);
    const maxDistance = Math.min(Math.floor(((w.length + it.length + 3) * MOVE_COST) / 6), best - 1);
    const d = levenshtein(w, it, maxDistance);
    if (d > maxDistance) continue;
    if (suggestion === null || d < best) {
      suggestion = item;
      best = d;
    }
  }
  return suggestion;
}

function getattrUser(attr) {
  if (Object.prototype.hasOwnProperty.call(USER, attr)) return USER[attr];
  const s = suggest(USER_DIR, attr);
  return raise('AttributeError', `'User' object has no attribute '${attr}'` + (s ? `. Did you mean: '${s}'?` : ''));
}

// ── Handle: int(re.match(r'[0-9]+', text).group()) ───────────
const INT_MAX_STR_DIGITS = 4300;

function handle(text) {
  const m = /^[0-9]+/.exec(text);
  if (m === null) {
    // f'{e}' is str(e): the traceback's suggestion is not part of it
    return "no match: 'NoneType' object has no attribute 'group'";
  }
  const digits = m[0];
  if (digits.length > INT_MAX_STR_DIGITS) {
    raise('ValueError', `Exceeds the limit (${INT_MAX_STR_DIGITS} digits) for integer string conversion: value has ${digits.length} digits; use sys.set_int_max_str_digits() to increase the limit`);
  }
  return BigInt(digits);
}

export default {
  trigger: (attr) => getattrUser(attr),
  handle: (text) => handle(text),
};
