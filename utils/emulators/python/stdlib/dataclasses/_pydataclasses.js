// utils/emulators/python/stdlib/dataclasses/_pydataclasses.js
//
// Port of CPython 3.13's Lib/dataclasses.py over a small Python object
// model — shared by the dataclasses hub and every member emulator. Not a
// content page (leading underscore), so the catalog generator never maps it.
//
// What is ported, line by line:
//   field() / Field / InitVar / KW_ONLY / MISSING / FrozenInstanceError
//   _process_class: base-field collection in reverse MRO, _get_field
//     (ClassVar / InitVar / KW_ONLY detection, the "mutable default" check
//     via type(default).__hash__ is None, kw_only inheritance), the
//     non-default-after-default check, frozen inheritance rules, the
//     _hash_action table, "Cannot overwrite attribute" errors, __match_args__,
//     weakref_slot / _add_slots (a NEW class is returned — and the frozen
//     __setattr__ keeps pointing at the old one, exactly like 3.13)
//   the generated methods: __init__ (with CPython's own argument binding and
//     its error messages, including 3.13's "Did you mean" for keywords),
//     __repr__ (recursive_repr), __eq__ (3.13: field-by-field "and" chain),
//     __lt__/__le__/__gt__/__ge__ (tuple comparison), frozen __setattr__ /
//     __delattr__, __hash__, __replace__
//   fields, asdict / astuple (_ATOMIC_TYPES fast path, recursion into
//     dataclasses, list, tuple, dict; copy.deepcopy for everything else),
//   replace, make_dataclass, is_dataclass.
// Around it: Python's attribute protocol (instance dict, __slots__ member
//   descriptors, class attributes, the AttributeError texts and the
//   traceback's "Did you mean" suggestion), rich comparison with reflected
//   operands, hash() for int / float / bool / None / tuple (bit-exact), dir().
//
// Value model: None → null · bool → true/false · int → bigint ·
//   float → PyFloat · str → string · list → Array · tuple → Tuple ·
//   dict → Dict · set → PySet · classes → PyClass · instances → PyObj ·
//   functions → PyFunction. String hashes and identity hashes are salted per
//   process in CPython, so they are modelled but flagged as unpredictable.

import { PyException } from '../../../../py-exceptions.js';
import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';

// ─── exceptions ─────────────────────────────────────────────

const EXC_PARENT = {
  'dataclasses.FrozenInstanceError': 'AttributeError',
  AttributeError: 'Exception',
  TypeError: 'Exception',
  ValueError: 'Exception',
  KeyError: 'LookupError',
  IndexError: 'LookupError',
  LookupError: 'Exception',
  NameError: 'Exception',
  RecursionError: 'RuntimeError',
  RuntimeError: 'Exception',
  ZeroDivisionError: 'ArithmeticError',
  OverflowError: 'ArithmeticError',
  ArithmeticError: 'Exception',
  Exception: 'BaseException',
};

// isinstance(exc, <name>) for an emulated exception
export function excMatches(e, name) {
  if (!(e instanceof PyException)) return false;
  for (let n = e.name; n; n = EXC_PARENT[n]) if (n === name) return true;
  return false;
}

export const raise = (type, msg = '') => { throw new PyException(type, msg); };

// Python frames currently executing (generated / user methods): the
// traceback's AttributeError suggestion looks at the innermost one's self.
const frames = [];

// AttributeError raised by the attribute machinery: str(e) is the plain
// message; the traceback adds ". Did you mean: 'x'?" (see finish()).
function attrError(msg, obj, name) {
  const e = new PyException('AttributeError', msg);
  e.attrObj = obj;
  e.attrName = name;
  const top = frames[frames.length - 1];
  e.selfFrame = top !== undefined && top.self === obj;
  return e;
}

// What the traceback's last line shows for an uncaught emulated exception:
// AttributeError (with .name/.obj set) gets the "Did you mean" suggestion
// that traceback.TracebackException computes (via _suggestions in 3.13).
export function finish(e) {
  if (e instanceof PyException && e.suggestionUnknown) {
    throw new Unpredictable('not emulated: whether the traceback adds a suggestion here depends on CPython-internal dict state');
  }
  if (e instanceof PyException && e.nameError && !e.finished) {
    // NameError inside a method: "Did you mean: 'self.x'?" when self has x;
    // otherwise candidates come from the defining module's globals
    e.finished = true;
    const { self, name } = e.nameError;
    if (self !== undefined && hasattr(self, name)) e.message += `. Did you mean: 'self.${name}'?`;
    else throw new Unpredictable('not emulated: NameError suggestions from module globals');
  }
  if (e instanceof PyException && e.attrName !== undefined && !e.finished) {
    e.finished = true;
    let d;
    try {
      d = dir(e.attrObj);
    } catch (err) {
      d = null;
    }
    if (d) {
      if (e.attrName[0] !== '_' && !e.selfFrame) d = d.filter((x) => x[0] !== '_');
      const s = calculateSuggestions(d, e.attrName);
      if (s !== null) e.message += `. Did you mean: ${pyStrRepr(s)}?`;
    }
  }
  return e;
}

// Run a demo body: uncaught exceptions leave with their traceback text.
export function run(fn) {
  try {
    return fn();
  } catch (e) {
    // self-referencing values compared / hashed / converted: CPython stops
    // with a RecursionError whose wording depends on where the limit hits
    if (e instanceof RangeError) throw new Unpredictable('not emulated: unbounded recursion (RecursionError)');
    throw finish(e);
  }
}

// Python/suggestions.c — _Py_CalculateSuggestions over UTF-8 bytes.
const MOVE_COST = 2;
const CASE_COST = 1;
const MAX_STRING_SIZE = 40;
const MAX_CANDIDATE_ITEMS = 750;
const utf8 = (s) => new TextEncoder().encode(s);

function substitutionCost(a, b) {
  if ((a & 31) !== (b & 31)) return MOVE_COST;
  if (a === b) return 0;
  // C chars are signed: bytes >= 0x80 never count as 'A'..'Z'
  let x = a;
  let y = b;
  if (x >= 65 && x <= 90) x += 32;
  if (y >= 65 && y <= 90) y += 32;
  if (x === y) return CASE_COST;
  return MOVE_COST;
}

function levenshtein(a0, b0, maxCost) {
  let a = a0;
  let b = b0;
  let as = 0;
  let ae = a.length;
  let bs = 0;
  let be = b.length;
  while (as < ae && bs < be && a[as] === b[bs]) { as += 1; bs += 1; }
  while (as < ae && bs < be && a[ae - 1] === b[be - 1]) { ae -= 1; be -= 1; }
  let aSize = ae - as;
  let bSize = be - bs;
  if (aSize === 0 || bSize === 0) return (aSize + bSize) * MOVE_COST;
  if (aSize > MAX_STRING_SIZE || bSize > MAX_STRING_SIZE) return maxCost + 1;
  a = a.subarray(as, ae);
  b = b.subarray(bs, be);
  if (bSize < aSize) {
    [a, b] = [b, a];
    [aSize, bSize] = [bSize, aSize];
  }
  if ((bSize - aSize) * MOVE_COST > maxCost) return maxCost + 1;
  const buffer = [];
  let tmp = MOVE_COST;
  for (let i = 0; i < aSize; i += 1) { buffer[i] = tmp; tmp += MOVE_COST; }
  let result = 0;
  for (let bi = 0; bi < bSize; bi += 1) {
    const code = b[bi];
    let distance = bi * MOVE_COST;
    result = distance;
    let minimum = Infinity;
    for (let i = 0; i < aSize; i += 1) {
      const substitute = distance + substitutionCost(code, a[i]);
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

export function calculateSuggestions(candidates, name) {
  if (candidates.length >= MAX_CANDIDATE_ITEMS) return null;
  let best = Infinity;
  let suggestion = null;
  const nameB = utf8(name);
  for (const item of candidates) {
    if (item === name) continue;
    const itemB = utf8(item);
    let maxDistance = Math.floor(((nameB.length + itemB.length + 3) * MOVE_COST) / 6);
    maxDistance = Math.min(maxDistance, best - 1);
    const d = levenshtein(nameB, itemB, maxDistance);
    if (d > maxDistance) continue;
    if (suggestion === null || d < best) {
      suggestion = item;
      best = d;
    }
  }
  return suggestion;
}

// ─── value model ────────────────────────────────────────────

let nextId = 0;
const ids = new WeakMap();
const idOf = (o) => {
  if (!ids.has(o)) { nextId += 1; ids.set(o, nextId); }
  return ids.get(o);
};

export class PyFloat {
  constructor(v) { this.v = v; }
}
export const float = (v) => new PyFloat(v);

export class Tuple {
  constructor(items) { this.items = items; }
}
export const tuple = (...items) => new Tuple(items);

export class PySet {
  constructor(items = []) {
    this.d = new Dict();
    for (const x of items) this.d.set(x, true);
  }
  get items() { return this.d.keys; }
}

// dict: insertion-ordered, Python key lookup (identity, then hash + ==)
export class Dict {
  constructor(entries = []) {
    this.keys = [];
    this.vals = [];
    this.hashes = [];
    for (const [k, v] of entries) this.set(k, v);
  }
  find(k) {
    const h = hashOf(k);
    for (let i = 0; i < this.keys.length; i += 1) {
      if (this.keys[i] === k) return i;
      if (this.hashes[i] === h && eqBool(this.keys[i], k)) return i;
    }
    return -1;
  }
  set(k, v) {
    const i = this.find(k);
    if (i === -1) {
      this.keys.push(k);
      this.vals.push(v);
      this.hashes.push(hashOf(k));
    } else this.vals[i] = v;
  }
  has(k) { return this.find(k) !== -1; }
  get(k) {
    const i = this.find(k);
    if (i === -1) raise('KeyError', repr(k));
    return this.vals[i];
  }
  get entries() { return this.keys.map((k, i) => [k, this.vals[i]]); }
  get size() { return this.keys.length; }
}

export class MappingProxy {
  constructor(d) { this.d = d; }
}

// a Python function: params = [{ name, kwOnly, default }] (default
// undefined = required); impl receives the bound locals as an array.
// rawImpl(args, kwargs) replaces binding for signatures with **kwargs.
export class PyFunction {
  constructor({ name, qualname = name, params = [], impl, rawImpl = null, module = '__main__' }) {
    Object.assign(this, { name, qualname, params, impl, rawImpl, module });
  }
}
export class BoundMethod {
  constructor(self, fn) { this.self = self; this.fn = fn; }
}
// a builtin callable (len, sorted …) — impl(args, kwargs)
export class Builtin {
  constructor(name, impl) { this.name = name; this.impl = impl; }
}

// __slots__ member descriptor
export class SlotDescriptor {
  constructor(name, owner) { this.name = name; this.owner = owner; }
}
// a stand-in for descriptors CPython puts in class dicts (__dict__,
// __weakref__ getsets, slot wrappers of object …): present for dir() only
class Opaque {
  constructor(label) { this.label = label; }
}

export class PyClass {
  constructor(name, { bases = [], qualname = name, module = '__main__', builtin = false } = {}) {
    this.name = name;
    this.qualname = qualname;
    this.module = module;
    this.bases = bases;
    this.builtin = builtin;
    this.dict = new Map();
    this.mro = builtin && bases.length === 0 ? [this] : c3(this, bases);
  }
  lookup(name) {
    for (const c of this.mro) if (c.dict.has(name)) return { found: true, value: c.dict.get(name), owner: c };
    return { found: false };
  }
  get ownSlots() {
    if (!this.dict.has('__slots__')) return null;
    const s = this.dict.get('__slots__');
    if (typeof s === 'string') return [s];
    if (s instanceof Tuple) return s.items;
    if (Array.isArray(s)) return s;
    return null;
  }
}

function c3(cls, bases) {
  const seqs = bases.map((b) => b.mro.slice()).concat([bases.slice()]);
  const out = [cls];
  for (;;) {
    const nonEmpty = seqs.filter((s) => s.length);
    if (!nonEmpty.length) return out;
    let cand = null;
    for (const s of nonEmpty) {
      const head = s[0];
      if (!nonEmpty.some((t) => t.indexOf(head) > 0)) { cand = head; break; }
    }
    if (!cand) raise('TypeError', 'Cannot create a consistent method resolution order (MRO)');
    out.push(cand);
    for (const s of nonEmpty) if (s[0] === cand) s.shift();
  }
}

export class PyObj {
  constructor(cls) {
    this.cls = cls;
    this.dict = cls.hasDict ? new Map() : null;
    this.slots = new Map();
  }
}

// ─── builtin types ──────────────────────────────────────────

const bt = (name, bases = [], module = 'builtins') => new PyClass(name, { bases, module, builtin: true });
export const OBJECT = bt('object');
OBJECT.hasDict = false;
OBJECT.weakrefable = false;
for (const n of ['__new__', '__repr__', '__hash__', '__str__', '__getattribute__', '__setattr__', '__delattr__', '__lt__', '__le__', '__eq__', '__ne__', '__gt__', '__ge__', '__init__', '__reduce_ex__', '__reduce__', '__getstate__', '__subclasshook__', '__init_subclass__', '__format__', '__sizeof__', '__dir__', '__class__', '__doc__']) {
  OBJECT.dict.set(n, new Opaque(`object.${n}`));
}
const OBJECT_SLOT = (name) => OBJECT.dict.get(name);

export const T = {
  object: OBJECT,
  int: bt('int', [OBJECT]),
  float: bt('float', [OBJECT]),
  str: bt('str', [OBJECT]),
  list: bt('list', [OBJECT]),
  tuple: bt('tuple', [OBJECT]),
  dict: bt('dict', [OBJECT]),
  set: bt('set', [OBJECT]),
  NoneType: bt('NoneType', [OBJECT]),
  type: bt('type', [OBJECT]),
  function: bt('function', [OBJECT]),
  method: bt('method', [OBJECT]),
  builtin_function_or_method: bt('builtin_function_or_method', [OBJECT]),
  mappingproxy: bt('mappingproxy', [OBJECT]),
  member_descriptor: bt('member_descriptor', [OBJECT]),
};
T.bool = bt('bool', [T.int]);
T.Field = bt('Field', [OBJECT], 'dataclasses');
T.InitVar = bt('InitVar', [OBJECT], 'dataclasses');
T._MISSING_TYPE = bt('_MISSING_TYPE', [OBJECT], 'dataclasses');
T._KW_ONLY_TYPE = bt('_KW_ONLY_TYPE', [OBJECT], 'dataclasses');
T._HAS_DEFAULT_FACTORY_CLASS = bt('_HAS_DEFAULT_FACTORY_CLASS', [OBJECT], 'dataclasses');
T.GenericAlias = bt('GenericAlias', [OBJECT], 'types');
T._SpecialForm = bt('_SpecialForm', [OBJECT], 'typing');
T._GenericAlias = bt('_GenericAlias', [OBJECT], 'typing');
for (const k of ['list', 'dict', 'set']) T[k].dict.set('__hash__', null);
for (const c of Object.values(T)) {
  if (c === OBJECT) continue;
  c.hasDict = false;
  c.weakrefable = false;
}

// sentinels
export const MISSING = { sentinel: '_MISSING_TYPE' };
export const KW_ONLY = { sentinel: '_KW_ONLY_TYPE' };
const HAS_DEFAULT_FACTORY = { sentinel: '_HAS_DEFAULT_FACTORY_CLASS' };
export const NotImplemented = { sentinel: 'NotImplementedType' };
const UNSET = Symbol('unset');

// typing.ClassVar / ClassVar[t]; list[int]
export const ClassVar = { specialForm: 'ClassVar' };
export class ClassVarAlias {
  constructor(arg) { this.arg = arg; }
}
export class GenericAlias {
  constructor(origin, args) { this.origin = origin; this.args = args; }
}

// dataclasses.InitVar[t]
export class InitVarObj {
  constructor(type) { this.type = type; }
}
export const InitVar = (type) => new InitVarObj(type);

// Field — only ever built by field()
const FIELD = '_FIELD';
const FIELD_CLASSVAR = '_FIELD_CLASSVAR';
const FIELD_INITVAR = '_FIELD_INITVAR';
export class Field {
  constructor(dflt, defaultFactory, init, rep, hash, compare, metadata, kwOnly) {
    this.name = null;
    this.type = null;
    this.default = dflt;
    this.default_factory = defaultFactory;
    this.init = init;
    this.repr = rep;
    this.hash = hash;
    this.compare = compare;
    this.metadata = new MappingProxy(metadata === null ? new Dict() : metadata);
    this.kw_only = kwOnly;
    this._field_type = null;
  }
}

// ─── type(), isinstance ─────────────────────────────────────

export function typeOf(v) {
  if (v === null || v === undefined) return T.NoneType;
  if (typeof v === 'boolean') return T.bool;
  if (typeof v === 'bigint') return T.int;
  if (typeof v === 'string') return T.str;
  if (v instanceof PyFloat) return T.float;
  if (Array.isArray(v)) return T.list;
  if (v instanceof Tuple) return T.tuple;
  if (v instanceof Dict) return T.dict;
  if (v instanceof PySet) return T.set;
  if (v instanceof PyObj) return v.cls;
  if (v instanceof PyClass) return T.type;
  if (v instanceof PyFunction) return T.function;
  if (v instanceof BoundMethod) return T.method;
  if (v instanceof Builtin) return T.builtin_function_or_method;
  if (v instanceof Field) return T.Field;
  if (v instanceof InitVarObj) return T.InitVar;
  if (v instanceof MappingProxy) return T.mappingproxy;
  if (v instanceof SlotDescriptor) return T.member_descriptor;
  if (v instanceof GenericAlias) return T.GenericAlias;
  if (v instanceof ClassVarAlias) return T._GenericAlias;
  if (v === ClassVar) return T._SpecialForm;
  if (v === MISSING) return T._MISSING_TYPE;
  if (v === KW_ONLY) return T._KW_ONLY_TYPE;
  if (v === HAS_DEFAULT_FACTORY) return T._HAS_DEFAULT_FACTORY_CLASS;
  return OBJECT;
}

export const isSubclass = (c, base) => c.mro.includes(base);
export const isInstance = (v, cls) => isSubclass(typeOf(v), cls);

// ─── repr / str ─────────────────────────────────────────────

const reprActive = new Set(); // Py_ReprEnter + reprlib.recursive_repr

export function typeRepr(c) {
  return c.module === 'builtins' ? `<class '${c.qualname}'>` : `<class '${c.module}.${c.qualname}'>`;
}

// _Py_typing_type_repr: how types print inside list[...] / InitVar
function typingRepr(t) {
  if (t instanceof PyClass) return t.module === 'builtins' ? t.qualname : `${t.module}.${t.qualname}`;
  return repr(t);
}

export function repr(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'string') return pyStrRepr(v);
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  if (Array.isArray(v)) {
    if (reprActive.has(v)) return '[...]';
    reprActive.add(v);
    try { return '[' + v.map(repr).join(', ') + ']'; } finally { reprActive.delete(v); }
  }
  if (v instanceof Tuple) {
    if (reprActive.has(v)) return '(...)';
    reprActive.add(v);
    try {
      const items = v.items.map(repr);
      return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
    } finally { reprActive.delete(v); }
  }
  if (v instanceof Dict) {
    if (reprActive.has(v)) return '{...}';
    reprActive.add(v);
    try { return '{' + v.entries.map(([k, x]) => `${repr(k)}: ${repr(x)}`).join(', ') + '}'; } finally { reprActive.delete(v); }
  }
  if (v instanceof PySet) {
    if (v.items.length === 0) return 'set()';
    unpredictable('the order of a non-empty set');
  }
  if (v instanceof MappingProxy) return `mappingproxy(${repr(v.d)})`;
  if (v instanceof PyClass) return typeRepr(v);
  if (v instanceof GenericAlias) return `${typingRepr(v.origin)}[${v.args.map(typingRepr).join(', ')}]`;
  if (v === ClassVar) return 'typing.ClassVar';
  if (v instanceof ClassVarAlias) return `typing.ClassVar[${typingRepr(v.arg)}]`;
  if (v instanceof InitVarObj) {
    const name = v.type instanceof PyClass ? v.type.name : repr(v.type);
    return `dataclasses.InitVar[${name}]`;
  }
  if (v === HAS_DEFAULT_FACTORY) return '<factory>';
  if (v === NotImplemented) return 'NotImplemented';
  if (v instanceof SlotDescriptor) return `<member '${v.name}' of '${v.owner.name}' objects>`;
  if (v instanceof PyObj) {
    const r = v.cls.lookup('__repr__');
    if (r.found && !(r.value instanceof Opaque)) return asStr(callFunction(r.value, [v], []), '__repr__');
  }
  // <__main__.C object at 0x…>, <function …>, Field(…default=<…MISSING… at 0x…>)
  return unpredictable(`the repr of ${typeOf(v).name} objects (it contains a memory address)`);
}

function asStr(v, what) {
  if (typeof v !== 'string') raise('TypeError', `${what} returned non-string (type ${typeOf(v).name})`);
  return v;
}

export class Unpredictable extends Error {}
function unpredictable(what) {
  throw new Unpredictable(`not emulated: ${what} differs between runs`);
}

export function str(v) {
  if (typeof v === 'string') return v;
  if (v instanceof PyObj) {
    const r = v.cls.lookup('__str__');
    if (r.found && !(r.value instanceof Opaque)) return asStr(callFunction(r.value, [v], []), '__str__');
  }
  return repr(v);
}

export function truthy(v) {
  if (v === null || v === undefined || v === false) return false;
  if (v === true) return true;
  if (typeof v === 'bigint') return v !== 0n;
  if (typeof v === 'string') return v.length > 0;
  if (v instanceof PyFloat) return v.v !== 0;
  if (Array.isArray(v)) return v.length > 0;
  if (v instanceof Tuple) return v.items.length > 0;
  if (v instanceof Dict) return v.size > 0;
  if (v instanceof PySet) return v.items.length > 0;
  return true;
}

// ─── comparisons ────────────────────────────────────────────

const OPSTR = { lt: '<', le: '<=', eq: '==', ne: '!=', gt: '>', ge: '>=' };
const SWAP = { lt: 'gt', le: 'ge', eq: 'eq', ne: 'ne', gt: 'lt', ge: 'le' };
const DUNDER = { lt: '__lt__', le: '__le__', eq: '__eq__', ne: '__ne__', gt: '__gt__', ge: '__ge__' };

const isNum = (v) => typeof v === 'bigint' || typeof v === 'boolean' || v instanceof PyFloat;
const asBig = (v) => (typeof v === 'boolean' ? (v ? 1n : 0n) : v);

// -1 / 0 / 1, or NaN when unordered (a NaN is involved)
function numCmp(a, b) {
  const x = asBig(a);
  const y = asBig(b);
  if (typeof x === 'bigint' && typeof y === 'bigint') return x < y ? -1 : x > y ? 1 : 0;
  if (x instanceof PyFloat && y instanceof PyFloat) {
    if (Number.isNaN(x.v) || Number.isNaN(y.v)) return NaN;
    return x.v < y.v ? -1 : x.v > y.v ? 1 : 0;
  }
  const flip = x instanceof PyFloat;
  const i = flip ? y : x;
  const f = flip ? x.v : y.v;
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

function cpCmp(a, b) {
  // code point order (JS < compares UTF-16 units)
  const x = [...a];
  const y = [...b];
  const n = Math.min(x.length, y.length);
  for (let i = 0; i < n; i += 1) {
    const p = x[i].codePointAt(0);
    const q = y[i].codePointAt(0);
    if (p !== q) return p < q ? -1 : 1;
  }
  return x.length < y.length ? -1 : x.length > y.length ? 1 : 0;
}

const fromCmp = (c, op) => {
  if (Number.isNaN(c)) return op === 'ne';
  switch (op) {
    case 'lt': return c < 0;
    case 'le': return c <= 0;
    case 'eq': return c === 0;
    case 'ne': return c !== 0;
    case 'gt': return c > 0;
    default: return c >= 0;
  }
};

// list / tuple richcompare: first index where items differ (identity, then
// ==), then compare lengths or those two items
function seqCompare(a, b, op) {
  let i = 0;
  for (; i < a.length && i < b.length; i += 1) {
    if (!eqBool(a[i], b[i])) break;
  }
  if (i >= a.length || i >= b.length) return fromCmp(a.length < b.length ? -1 : a.length > b.length ? 1 : 0, op);
  if (op === 'eq') return false;
  if (op === 'ne') return true;
  return richcmp(a[i], b[i], op);
}

// tp_richcompare of v's type (one direction) → value or NotImplemented
function slotCompare(v, w, op) {
  if (isNum(v)) {
    if (!isNum(w)) return NotImplemented;
    return fromCmp(numCmp(v, w), op);
  }
  if (typeof v === 'string') {
    if (typeof w !== 'string') return NotImplemented;
    return fromCmp(cpCmp(v, w), op);
  }
  if (Array.isArray(v)) {
    if (!Array.isArray(w)) return NotImplemented;
    return seqCompare(v, w, op);
  }
  if (v instanceof Tuple) {
    if (!(w instanceof Tuple)) return NotImplemented;
    return seqCompare(v.items, w.items, op);
  }
  if (v instanceof Dict) {
    if (!(w instanceof Dict) || (op !== 'eq' && op !== 'ne')) return NotImplemented;
    let same = v.size === w.size;
    if (same) {
      for (const [k, x] of v.entries) {
        const i = w.find(k);
        if (i === -1 || !eqBool(x, w.vals[i])) { same = false; break; }
      }
    }
    return op === 'eq' ? same : !same;
  }
  if (v instanceof MappingProxy) return slotCompare(v.d, w instanceof MappingProxy ? w.d : w, op);
  if (v instanceof PyObj) {
    const m = v.cls.lookup(DUNDER[op]);
    if (m.found && !(m.value instanceof Opaque)) return callFunction(m.value, [v, w], []);
    // object_richcompare
    if (op === 'eq') return v === w ? true : NotImplemented;
    if (op === 'ne') {
      const r = slotCompare(v, w, 'eq');
      return r === NotImplemented ? r : !truthy(r);
    }
    return NotImplemented;
  }
  if (op === 'eq') return v === w ? true : NotImplemented;
  if (op === 'ne') return v === w ? false : NotImplemented;
  return NotImplemented;
}

// do_richcompare: reflected operand first when type(w) is a subclass
export function richcmp(v, w, op) {
  const tv = typeOf(v);
  const tw = typeOf(w);
  let checkedReverse = false;
  if (tv !== tw && isSubclass(tw, tv)) {
    checkedReverse = true;
    const r = slotCompare(w, v, SWAP[op]);
    if (r !== NotImplemented) return r;
  }
  const r = slotCompare(v, w, op);
  if (r !== NotImplemented) return r;
  if (!checkedReverse) {
    const r2 = slotCompare(w, v, SWAP[op]);
    if (r2 !== NotImplemented) return r2;
  }
  if (op === 'eq') return v === w;
  if (op === 'ne') return v !== w;
  return raise('TypeError', `'${OPSTR[op]}' not supported between instances of '${tv.name}' and '${tw.name}'`);
}

// PyObject_RichCompareBool(v, w, Py_EQ): identity first
export function eqBool(v, w) {
  if (v === w) return true;
  return truthy(richcmp(v, w, 'eq'));
}

// ─── hash ───────────────────────────────────────────────────

const M64 = (1n << 64n) - 1n;
const P61 = (1n << 61n) - 1n;
const s64 = (u) => (u & (1n << 63n) ? u - (1n << 64n) : u);
const u64 = (s) => s & M64;

function hashInt(x) {
  let h = (x < 0n ? -x : x) % P61;
  if (x < 0n) h = -h;
  return h === -1n ? -2n : h;
}

// _Py_HashDouble (non-finite and NaN handled by the caller)
function hashDouble(v) {
  if (v === 0) return 0n;
  let m = Math.abs(v);
  const sign = v < 0 ? -1n : 1n;
  let e = 0;
  // frexp
  while (m >= 1) { m /= 2; e += 1; }
  while (m < 0.5) { m *= 2; e -= 1; }
  let x = 0n;
  while (m) {
    x = ((x << 28n) & P61) | (x >> (61n - 28n));
    m *= 268435456.0;
    e -= 28;
    const y = Math.floor(m);
    m -= y;
    x += BigInt(y);
    if (x >= P61) x -= P61;
  }
  const ee = e >= 0 ? e % 61 : 60 - ((-1 - e) % 61);
  x = ((x << BigInt(ee)) & P61) | (x >> BigInt(61 - ee));
  x *= sign;
  return x === -1n ? -2n : x;
}

// FNV-1a stand-in for salted / address-based hashes (never displayed)
function fakeHash(s) {
  let h = 0xcbf29ce484222325n;
  for (const b of utf8(s)) h = ((h ^ BigInt(b)) * 0x100000001b3n) & M64;
  return s64(h) === -1n ? -2n : s64(h);
}

const XXPRIME_1 = 11400714785074694791n;
const XXPRIME_2 = 14029467366897019727n;
const XXPRIME_5 = 2870177450012600261n;

// hash(v) as a BigInt; TypeError for unhashable values
export function hashOf(v) {
  if (v === null || v === undefined) return 4238894112n;
  if (typeof v === 'boolean') return v ? 1n : 0n;
  if (typeof v === 'bigint') return hashInt(v);
  if (v instanceof PyFloat) {
    if (Number.isNaN(v.v)) return fakeHash(`id:${idOf(v)}`);
    if (v.v === Infinity) return 314159n;
    if (v.v === -Infinity) return -314159n;
    return hashDouble(v.v);
  }
  if (typeof v === 'string') return fakeHash(`s:${v}`);
  if (v instanceof Tuple) {
    let acc = XXPRIME_5;
    for (const item of v.items) {
      const lane = u64(hashOf(item));
      acc = (acc + lane * XXPRIME_2) & M64;
      acc = ((acc << 31n) | (acc >> 33n)) & M64;
      acc = (acc * XXPRIME_1) & M64;
    }
    acc = (acc + (BigInt(v.items.length) ^ (XXPRIME_5 ^ 3527539n))) & M64;
    if (acc === M64) return 1546275796n;
    return s64(acc);
  }
  const t = typeOf(v);
  const h = t.lookup('__hash__');
  if (h.found && h.value === null) raise('TypeError', `unhashable type: '${t.name}'`);
  if (v instanceof PyObj && h.found && !(h.value instanceof Opaque)) {
    // slot_tp_hash: values inside Py_hash_t are kept as they are
    const r = asBig(callFunction(h.value, [v], []));
    if (typeof r !== 'bigint') raise('TypeError', '__hash__ method should return an integer');
    const inRange = r >= -(1n << 63n) && r < (1n << 63n);
    const out = inRange ? r : hashInt(r);
    return out === -1n ? -2n : out;
  }
  return fakeHash(`id:${idOf(v)}`);
}

// can hash(v) be shown? (str hashes are salted, identity hashes are
// addresses — CPython prints different numbers in every process)
export function hashPredictable(v) {
  if (v === null || typeof v === 'boolean' || typeof v === 'bigint') return true;
  if (v instanceof PyFloat) return !Number.isNaN(v.v);
  if (v instanceof Tuple) return v.items.every(hashPredictable);
  if (v instanceof PyObj) {
    const h = v.cls.lookup('__hash__');
    if (!h.found || h.value === null || h.value instanceof Opaque) return false;
    if (h.value.hashFields) return h.value.hashFields.every((n) => hashPredictable(getattr(v, n)));
  }
  return false;
}

// ─── attributes ─────────────────────────────────────────────

const isDataDescr = (d) => d instanceof SlotDescriptor;

export function getattr(obj, name) {
  if (obj instanceof PyObj) {
    const d = obj.cls.lookup(name);
    if (d.found && isDataDescr(d.value)) {
      if (obj.slots.has(name)) return obj.slots.get(name);
      throw attrError(`'${obj.cls.name}' object has no attribute '${name}'`, obj, name);
    }
    if (obj.dict && obj.dict.has(name)) return obj.dict.get(name);
    if (d.found && !(d.value instanceof Opaque)) {
      if (d.value instanceof PyFunction) return new BoundMethod(obj, d.value);
      return d.value;
    }
    if (name === '__class__') return obj.cls;
    if (name === '__dict__' && obj.dict) return new Dict([...obj.dict.entries()]);
    throw attrError(`'${obj.cls.name}' object has no attribute '${name}'`, obj, name);
  }
  if (obj instanceof PyClass) {
    const d = obj.lookup(name);
    if (d.found && d.value instanceof DocThunk) return d.value.value;
    if (d.found && !(d.value instanceof Opaque)) return d.value;
    if (name === '__name__') return obj.name;
    if (name === '__qualname__') return obj.qualname;
    if (name === '__module__') return obj.module;
    throw attrError(`type object '${obj.name}' has no attribute '${name}'`, obj, name);
  }
  if (obj instanceof Field) {
    if (name in obj && name !== '_field_type') return obj[name];
  }
  if (obj instanceof InitVarObj && name === 'type') return obj.type;
  const t = typeOf(obj);
  const d = t.lookup(name);
  if (d.found && !(d.value instanceof Opaque)) return d.value;
  throw attrError(`'${t.name}' object has no attribute '${name}'`, obj, name);
}

export function hasattr(obj, name) {
  try {
    getattr(obj, name);
    return true;
  } catch (e) {
    if (excMatches(e, 'AttributeError')) return false;
    throw e;
  }
}

// PyObject_GenericSetAttr (value UNSET = delete)
function genericSetattr(obj, name, value) {
  const t = obj.cls;
  const d = t.lookup(name);
  // object.__class__ is a data descriptor (a getset): its setter only
  // accepts classes, its deleter always refuses
  if (name === '__class__' && d.found && d.owner === OBJECT) {
    if (value === UNSET) raise('TypeError', "can't delete __class__ attribute");
    if (!(value instanceof PyClass)) raise('TypeError', `__class__ must be set to a class, not '${typeOf(value).name}' object`);
    return unpredictable('__class__ assignment');
  }
  // the __dict__ / __weakref__ getsets type.__new__ puts in a class dict
  if (d.found && d.value instanceof Opaque && d.value.label === '__weakref__') {
    raise('AttributeError', `attribute '__weakref__' of '${d.owner.name}' objects is not writable`);
  }
  if (d.found && d.value instanceof Opaque && d.value.label === '__dict__' && obj.dict) {
    if (value === UNSET) {
      obj.dict = new Map(); // a fresh empty dict appears on the next access
      return;
    }
    if (!(value instanceof Dict)) raise('TypeError', `__dict__ must be set to a dictionary, not a '${typeOf(value).name}'`);
    return unpredictable('__dict__ assignment');
  }
  if (d.found && isDataDescr(d.value)) {
    if (value === UNSET) {
      if (!obj.slots.has(name)) raise('AttributeError', name);
      obj.slots.delete(name);
    } else obj.slots.set(name, value);
    return;
  }
  if (obj.dict) {
    if (value === UNSET) {
      if (!obj.dict.has(name)) {
        // 3.13: an instance with inline values (a __dict__ and no slot
        // members anywhere in the MRO) raises with or without .name/.obj
        // depending on the class's shared-key table and on whether the
        // dict was materialised — CPython internals, invisible from Python.
        // A real dict's KeyError path always sets them (→ suggestion).
        const msg = `'${t.name}' object has no attribute '${name}'`;
        if (t.inlineValues) {
          const e = new PyException('AttributeError', msg);
          e.suggestionUnknown = true;
          throw e;
        }
        throw attrError(msg, obj, name);
      }
      obj.dict.delete(name);
    } else obj.dict.set(name, value);
    return;
  }
  if (!d.found) {
    const generic = t.lookup('__setattr__').value === OBJECT_SLOT('__setattr__');
    throw attrError(
      generic
        ? `'${t.name}' object has no attribute '${name}' and no __dict__ for setting new attributes`
        : `'${t.name}' object has no attribute '${name}'`,
      obj, name,
    );
  }
  raise('AttributeError', `'${t.name}' object attribute '${name}' is read-only`);
}

// object.__setattr__ / object.__delattr__ — bypass the class's own hooks
export const objectSetattr = (obj, name, value) => genericSetattr(obj, name, value);
export const objectDelattr = (obj, name) => genericSetattr(obj, name, UNSET);

export function setattr(obj, name, value) {
  if (!(obj instanceof PyObj)) {
    if (obj instanceof PyClass) {
      obj.dict.set(name, value);
      return;
    }
    const t = typeOf(obj);
    throw attrError(`'${t.name}' object has no attribute '${name}' and no __dict__ for setting new attributes`, obj, name);
  }
  const m = obj.cls.lookup('__setattr__');
  if (m.value instanceof PyFunction) {
    callFunction(m.value, [obj, name, value], []);
    return;
  }
  genericSetattr(obj, name, value);
}

export function delattr(obj, name) {
  if (obj instanceof PyClass) {
    if (!obj.dict.has(name)) throw attrError(`type object '${obj.name}' has no attribute '${name}'`, obj, name);
    obj.dict.delete(name);
    return;
  }
  const m = obj.cls.lookup('__delattr__');
  if (m.value instanceof PyFunction) {
    callFunction(m.value, [obj, name], []);
    return;
  }
  genericSetattr(obj, name, UNSET);
}

// super(cls, self).<name>: the next class after cls in type(self).__mro__
function superLookup(cls, self, name) {
  const t = typeOf(self);
  if (!isSubclass(t, cls)) {
    raise('TypeError', `super(type, obj): obj (instance of ${t.name}) is not an instance or subtype of type (${cls.name}).`);
  }
  const mro = t.mro;
  for (let i = mro.indexOf(cls) + 1; i < mro.length; i += 1) {
    if (mro[i].dict.has(name)) return mro[i].dict.get(name);
  }
  return undefined;
}

// dir(obj): instance __dict__ + every class dict along the MRO, sorted
export function dir(obj) {
  const names = new Set();
  if (obj instanceof PyObj) {
    if (obj.dict) for (const k of obj.dict.keys()) names.add(k);
    for (const c of obj.cls.mro) for (const k of c.dict.keys()) names.add(k);
  } else if (obj instanceof PyClass) {
    for (const c of obj.mro) for (const k of c.dict.keys()) names.add(k);
  } else {
    for (const c of typeOf(obj).mro) for (const k of c.dict.keys()) names.add(k);
  }
  return [...names].sort(cpCmp);
}

// ─── calls ──────────────────────────────────────────────────

// Python/ceval.c initialize_locals for a function without *args/**kwargs
function bindArgs(fn, args, kwargs) {
  const pos = fn.params.filter((p) => !p.kwOnly);
  const kwo = fn.params.filter((p) => p.kwOnly);
  const all = pos.concat(kwo);
  const argcount = pos.length;
  const locals = all.map(() => UNSET);
  const n = Math.min(args.length, argcount);
  for (let i = 0; i < n; i += 1) locals[i] = args[i];
  for (const [kw, val] of kwargs) {
    const j = all.findIndex((p) => p.name === kw);
    if (j === -1) {
      const sugg = calculateSuggestions(all.map((p) => p.name), kw);
      raise('TypeError', `${fn.qualname}() got an unexpected keyword argument '${kw}'${sugg !== null ? `. Did you mean '${sugg}'?` : ''}`);
    }
    if (locals[j] !== UNSET) raise('TypeError', `${fn.qualname}() got multiple values for argument '${kw}'`);
    locals[j] = val;
  }
  if (args.length > argcount) {
    let kwonlyGiven = 0;
    for (let i = argcount; i < all.length; i += 1) if (locals[i] !== UNSET) kwonlyGiven += 1;
    const defcount = pos.filter((p) => p.default !== undefined).length;
    let sig;
    let plural;
    if (defcount) {
      plural = true;
      sig = `from ${argcount - defcount} to ${argcount}`;
    } else {
      plural = argcount !== 1;
      sig = String(argcount);
    }
    const given = args.length;
    const kwSig = kwonlyGiven
      ? ` positional argument${given !== 1 ? 's' : ''} (and ${kwonlyGiven} keyword-only argument${kwonlyGiven !== 1 ? 's' : ''})`
      : '';
    raise('TypeError', `${fn.qualname}() takes ${sig} positional argument${plural ? 's' : ''} but ${given}${kwSig} ${given === 1 && !kwonlyGiven ? 'was' : 'were'} given`);
  }
  if (args.length < argcount) {
    const defcount = pos.filter((p) => p.default !== undefined).length;
    const m = argcount - defcount;
    const missing = [];
    for (let i = 0; i < m; i += 1) if (locals[i] === UNSET) missing.push(pyStrRepr(pos[i].name));
    if (missing.length) raise('TypeError', formatMissing(fn.qualname, 'positional', missing));
    for (let i = args.length; i < argcount; i += 1) if (locals[i] === UNSET) locals[i] = pos[i].default;
  }
  if (kwo.length) {
    const missing = [];
    for (let i = argcount; i < all.length; i += 1) {
      if (locals[i] !== UNSET) continue;
      if (all[i].default !== undefined) { locals[i] = all[i].default; continue; }
      missing.push(pyStrRepr(all[i].name));
    }
    if (missing.length) raise('TypeError', formatMissing(fn.qualname, 'keyword-only', missing));
  }
  return locals;
}

function formatMissing(qualname, kind, names) {
  let s;
  if (names.length === 1) s = names[0];
  else if (names.length === 2) s = `${names[0]} and ${names[1]}`;
  else s = `${names.slice(0, -2).join(', ')}, ${names[names.length - 2]}, and ${names[names.length - 1]}`;
  return `${qualname}() missing ${names.length} required ${kind} argument${names.length === 1 ? '' : 's'}: ${s}`;
}

// call a Python-level function; the first positional arg is self for methods
export function callFunction(fn, args, kwargs = []) {
  if (fn instanceof BoundMethod) return callFunction(fn.fn, [fn.self, ...args], kwargs);
  if (fn instanceof Builtin) return fn.impl(args, kwargs);
  if (fn instanceof PyClass) return callClass(fn, args, kwargs);
  if (!(fn instanceof PyFunction)) raise('TypeError', `'${typeOf(fn).name}' object is not callable`);
  if (fn.rawImpl) return fn.rawImpl(args, kwargs);
  const locals = bindArgs(fn, args, kwargs);
  const self = fn.params.length && !fn.params[0].kwOnly ? locals[0] : undefined;
  frames.push({ self });
  try {
    const r = fn.impl(locals);
    return r === undefined ? null : r;
  } finally {
    frames.pop();
  }
}
export const call = callFunction;

// type.__call__(cls, *args, **kwargs)
export function callClass(cls, args, kwargs = []) {
  if (cls.builtin) return builtinConstruct(cls, args, kwargs);
  const init = cls.lookup('__init__');
  const hasInit = init.found && !(init.value instanceof Opaque);
  if (!hasInit && (args.length || kwargs.length)) raise('TypeError', `${cls.name}() takes no arguments`);
  const obj = new PyObj(cls);
  if (hasInit) {
    const r = callFunction(init.value, [obj, ...args], kwargs);
    if (r !== null) raise('TypeError', `__init__() should return None, not '${typeOf(r).name}'`);
  }
  return obj;
}

function iterate(v) {
  if (Array.isArray(v)) return v.slice();
  if (v instanceof Tuple) return v.items.slice();
  if (typeof v === 'string') return [...v];
  if (v instanceof Dict) return v.keys.slice();
  if (v instanceof PySet) return v.items.slice();
  return raise('TypeError', `'${typeOf(v).name}' object is not iterable`);
}

function builtinConstruct(cls, args, kwargs) {
  if (kwargs.length) raise('TypeError', `${cls.name}() takes no keyword arguments`);
  const a = args[0];
  switch (cls) {
    case T.list: return args.length ? iterate(a) : [];
    case T.tuple: return args.length ? new Tuple(iterate(a)) : new Tuple([]);
    case T.dict: return args.length ? new Dict(iterate(a).map((p) => iterate(p))) : new Dict();
    case T.set: return new PySet(args.length ? iterate(a) : []);
    case T.int: return args.length ? a : 0n;
    case T.str: return args.length ? str(a) : '';
    case T.float: return args.length ? a : new PyFloat(0);
    case T.bool: return args.length ? truthy(a) : false;
    default: return raise('TypeError', `cannot create '${cls.name}' instances`);
  }
}

// ─── class creation (type.__new__) ──────────────────────────

// body: [{ name, value }] class-body assignments and
//       [{ ann: name, type, value? }] annotated names, in source order
export function makeClass(name, { bases = [], body = [], qualname = name, module = '__main__', doc = null, staticAttributes = [] } = {}) {
  const ns = new Map();
  ns.set('__module__', module);
  ns.set('__firstlineno__', 1n);
  const annotations = new Map();
  if (body.some((e) => e.ann !== undefined)) ns.set('__annotations__', annotations);
  for (const e of body) {
    if (e.ann !== undefined) {
      if (e.value !== undefined) ns.set(e.ann, e.value);
      annotations.set(e.ann, e.type);
    } else ns.set(e.name, e.value);
  }
  ns.set('__static_attributes__', new Tuple(staticAttributes));
  if (doc !== null) ns.set('__doc__', doc);
  return typeNew(name, bases.length ? bases : [OBJECT], ns, qualname);
}

function typeNew(name, bases, ns, qualname) {
  const cls = new PyClass(name, { bases, qualname, module: ns.get('__module__') });
  const dict = cls.dict;
  for (const [k, v] of ns) dict.set(k, v);
  // a class body that defines __eq__ but not __hash__ gets __hash__ = None
  if (dict.has('__eq__') && !dict.has('__hash__')) dict.set('__hash__', null);
  const slots = cls.ownSlots;
  const baseDict = cls.mro.slice(1).some((c) => c.hasDict);
  const baseWeak = cls.mro.slice(1).some((c) => c.weakrefable);
  if (slots === null) {
    cls.hasDict = true;
    cls.weakrefable = true;
    if (!baseDict) dict.set('__dict__', new Opaque('__dict__'));
    if (!baseWeak) dict.set('__weakref__', new Opaque('__weakref__'));
  } else {
    cls.hasDict = baseDict || slots.includes('__dict__');
    cls.weakrefable = baseWeak || slots.includes('__weakref__');
    if (slots.includes('__weakref__') && baseWeak) raise('TypeError', '__weakref__ slot disallowed: we already got one');
    if (slots.includes('__dict__') && baseDict) raise('TypeError', '__dict__ slot disallowed: we already got one');
    for (const s of slots) {
      if (s === '__dict__' || s === '__weakref__') continue;
      if (ns.has(s)) raise('ValueError', `${pyStrRepr(s)} in __slots__ conflicts with class variable`);
    }
    if (slots.includes('__dict__') && !baseDict) dict.set('__dict__', new Opaque('__dict__'));
    if (slots.includes('__weakref__') && !baseWeak) dict.set('__weakref__', new Opaque('__weakref__'));
  }
  if (!dict.has('__doc__')) dict.set('__doc__', null);
  cls.inlineValues = cls.hasDict && cls.mro.every((c) => (c.ownSlots || []).every((s) => s === '__dict__' || s === '__weakref__'));
  if (slots !== null) {
    for (const s of slots) if (s !== '__dict__' && s !== '__weakref__') dict.set(s, new SlotDescriptor(s, cls));
  }
  return cls;
}

// a Python function defined in a class body: def name(self, a, b=…, *, c)
// (owner = the class's qualname)
export function method(owner, name, params, impl) {
  return new PyFunction({
    name,
    qualname: `${owner}.${name}`,
    params: params.map((p) => (typeof p === 'string' ? { name: p } : p)),
    impl,
  });
}

// ─── dataclasses ────────────────────────────────────────────

export function field({
  default: dflt = MISSING, default_factory: defaultFactory = MISSING, init = true, repr: rep = true,
  hash = null, compare = true, metadata = null, kw_only: kwOnly = MISSING,
} = {}) {
  if (dflt !== MISSING && defaultFactory !== MISSING) raise('ValueError', 'cannot specify both default and default_factory');
  return new Field(dflt, defaultFactory, init, rep, hash, compare, metadata, kwOnly);
}

const isClassVar = (t) => t === ClassVar || t instanceof ClassVarAlias;
const isInitVar = (t) => t === T.InitVar || t instanceof InitVarObj;

// getattr(cls, name, MISSING) for a class whose metaclass is type:
// type's data descriptors first, then the class's MRO dicts, then type's
// other attributes. Values nobody can print exactly (slot wrappers,
// type.mro, sizes) are Opaque stand-ins — hashable, repr not emulated.
const TYPE_DATA = new Set(['__abstractmethods__', '__annotations__', '__base__', '__bases__', '__basicsize__', '__class__', '__dict__', '__dictoffset__', '__doc__', '__flags__', '__itemsize__', '__module__', '__mro__', '__name__', '__qualname__', '__text_signature__', '__type_params__', '__weakrefoffset__']);
const TYPE_NONDATA = new Set(['__call__', '__instancecheck__', '__or__', '__prepare__', '__ror__', '__subclasscheck__', '__subclasses__', 'mro']);

function classGetattr(cls, name) {
  if (TYPE_DATA.has(name)) {
    switch (name) {
      case '__abstractmethods__': return cls.dict.has(name) ? cls.dict.get(name) : MISSING;
      case '__annotations__': return new Dict([...(cls.dict.get('__annotations__') || new Map()).entries()]);
      case '__class__': return T.type;
      case '__doc__': {
        const doc = cls.dict.has('__doc__') ? cls.dict.get('__doc__') : null;
        return doc instanceof DocThunk ? doc.value : doc;
      }
      case '__module__': return cls.module;
      case '__name__': return cls.name;
      case '__qualname__': return cls.qualname;
      case '__bases__': return new Tuple(cls.bases.slice());
      case '__mro__': return new Tuple(cls.mro.slice());
      case '__base__': return cls.bases.length === 1 ? cls.bases[0] : new Opaque('__base__');
      case '__type_params__': return new Tuple([]);
      case '__text_signature__': return null;
      default: return new Opaque(name); // __dict__ (a mappingproxy), the size / offset ints
    }
  }
  const d = cls.lookup(name);
  if (d.found) return d.value;
  if (TYPE_NONDATA.has(name)) return new Opaque(`type.${name}`);
  return MISSING;
}

function getField(cls, aName, aType, defaultKwOnly) {
  let dflt = classGetattr(cls, aName);
  let f;
  if (dflt instanceof Field) f = dflt;
  else {
    if (dflt instanceof SlotDescriptor) dflt = MISSING;
    f = field({ default: dflt });
  }
  f.name = aName;
  f.type = aType;
  f._field_type = FIELD;
  if (isClassVar(aType)) f._field_type = FIELD_CLASSVAR;
  if (f._field_type === FIELD && isInitVar(aType)) f._field_type = FIELD_INITVAR;
  if (f._field_type === FIELD_CLASSVAR || f._field_type === FIELD_INITVAR) {
    if (f.default_factory !== MISSING) raise('TypeError', `field ${f.name} cannot have a default factory`);
  }
  if (f._field_type === FIELD || f._field_type === FIELD_INITVAR) {
    if (f.kw_only === MISSING) f.kw_only = defaultKwOnly;
  } else if (f.kw_only !== MISSING) {
    raise('TypeError', `field ${f.name} is a ClassVar but specifies kw_only`);
  }
  if (f._field_type === FIELD) {
    const h = typeOf(f.default).lookup('__hash__');
    if (h.found && h.value === null) {
      raise('ValueError', `mutable default ${typeRepr(typeOf(f.default))} for field ${f.name} is not allowed: use default_factory`);
    }
  }
  return f;
}

function setNewAttribute(cls, name, value) {
  if (cls.dict.has(name)) return true;
  cls.dict.set(name, value);
  return false;
}

const fieldValues = (self, flds) => flds.map((f) => getattr(self, f.name));

export const DATACLASS_DEFAULTS = {
  init: true, repr: true, eq: true, order: false, unsafe_hash: false, frozen: false,
  match_args: true, kw_only: false, slots: false, weakref_slot: false,
};

// @dataclass(**params) applied to cls; returns the (possibly new) class
export function dataclass(cls, params = {}) {
  const p = { ...DATACLASS_DEFAULTS, ...params };
  return processClass(cls, p);
}

function processClass(cls0, p) {
  let cls = cls0;
  const { init, eq, order, frozen, slots } = p;
  let kwOnly = p.kw_only;
  const fields = new Map();
  cls.dict.set('__dataclass_params__', { params: p });

  let anyFrozenBase = false;
  let allFrozenBases = null;
  let hasDataclassBases = false;
  for (const b of cls.mro.slice(1).reverse()) {
    if (b === OBJECT) continue;
    const bf = b.lookup('__dataclass_fields__');
    if (bf.found) {
      hasDataclassBases = true;
      for (const f of bf.value.values()) fields.set(f.name, f);
      if (allFrozenBases === null) allFrozenBases = true;
      const cur = Boolean(b.lookup('__dataclass_params__').value.params.frozen);
      allFrozenBases = allFrozenBases && cur;
      anyFrozenBase = anyFrozenBase || cur;
    }
  }

  const annotations = cls.dict.get('__annotations__') || new Map();
  const clsFields = [];
  let kwOnlySeen = false;
  for (const [name, type] of annotations) {
    if (type === KW_ONLY) {
      if (kwOnlySeen) raise('TypeError', `${pyStrRepr(name)} is KW_ONLY, but KW_ONLY has already been specified`);
      kwOnlySeen = true;
      kwOnly = true;
    } else clsFields.push(getField(cls, name, type, kwOnly));
  }
  for (const f of clsFields) {
    fields.set(f.name, f);
    const cur = cls.lookup(f.name);
    if (cur.found && cur.value instanceof Field) {
      if (f.default === MISSING) delattr(cls, f.name);
      else cls.dict.set(f.name, f.default);
    }
  }
  for (const [name, value] of cls.dict) {
    if (value instanceof Field && !annotations.has(name)) raise('TypeError', `${pyStrRepr(name)} is a field but has no type annotation`);
  }
  if (hasDataclassBases) {
    if (anyFrozenBase && !frozen) raise('TypeError', 'cannot inherit non-frozen dataclass from a frozen one');
    if (allFrozenBases === false && frozen) raise('TypeError', 'cannot inherit frozen dataclass from a non-frozen one');
  }
  cls.dict.set('__dataclass_fields__', fields);

  const classHash = cls.dict.has('__hash__') ? cls.dict.get('__hash__') : MISSING;
  const hasExplicitHash = !(classHash === MISSING || (classHash === null && cls.dict.has('__eq__')));

  if (order && !eq) raise('ValueError', 'eq must be true if order is true');

  const allInitFields = [...fields.values()].filter((f) => f._field_type === FIELD || f._field_type === FIELD_INITVAR);
  const stdInitFields = allInitFields.filter((f) => f.init && !f.kw_only);
  const kwOnlyInitFields = allInitFields.filter((f) => f.init && f.kw_only);

  const toAdd = []; // [name, fn, overwriteError, unconditional]
  const qual = (n) => `${cls.qualname}.${n}`;
  const originalCls = cls;

  if (init) {
    const hasPostInit = cls.lookup('__post_init__').found;
    let seenDefault = null;
    for (const f of stdInitFields) {
      if (f.init) {
        if (!(f.default === MISSING && f.default_factory === MISSING)) seenDefault = f;
        else if (seenDefault) raise('TypeError', `non-default argument ${pyStrRepr(f.name)} follows default argument ${pyStrRepr(seenDefault.name)}`);
      }
    }
    const selfName = fields.has('self') ? '__dataclass_self__' : 'self';
    const param = (f, kw) => {
      let dflt;
      if (f.default !== MISSING) dflt = f.default;
      else if (f.default_factory !== MISSING) dflt = HAS_DEFAULT_FACTORY;
      return { name: f.name, kwOnly: kw, default: dflt };
    };
    const params = [{ name: selfName }, ...stdInitFields.map((f) => param(f, false)), ...kwOnlyInitFields.map((f) => param(f, true))];
    const paramIndex = new Map(params.map((pp, i) => [pp.name, i]));
    const fn = new PyFunction({
      name: '__init__',
      qualname: qual('__init__'),
      params,
      impl: (locals) => {
        const self = locals[0];
        const local = (n) => {
          if (!paramIndex.has(n)) {
            // an init=False InitVar passed to __post_init__: not a parameter
            const err = new PyException('NameError', `name '${n}' is not defined`);
            err.nameError = { self: selfName === 'self' ? self : undefined, name: n };
            throw err;
          }
          return locals[paramIndex.get(n)];
        };
        for (const f of allInitFields) {
          let value;
          let assign = true;
          if (f.default_factory !== MISSING) {
            if (f.init) {
              const v = local(f.name);
              value = v === HAS_DEFAULT_FACTORY ? callFunction(f.default_factory, [], []) : v;
            } else value = callFunction(f.default_factory, [], []);
          } else if (f.init) value = local(f.name);
          else if (slots && f.default !== MISSING) value = f.default;
          else assign = false;
          if (f._field_type === FIELD_INITVAR) assign = false;
          if (!assign) continue;
          if (frozen) objectSetattr(self, f.name, value);
          else setattr(self, f.name, value);
        }
        if (hasPostInit) {
          const ivs = allInitFields.filter((f) => f._field_type === FIELD_INITVAR).map((f) => local(f.name));
          callFunction(getattr(self, '__post_init__'), ivs, []);
        }
        return null;
      },
    });
    fn.annotations = new Map([...stdInitFields, ...kwOnlyInitFields].map((f) => [f.name, f.type]));
    toAdd.push(['__init__', fn, false, false]);
  }

  setNewAttribute(cls, '__replace__', REPLACE_FN);

  const fieldList = [...fields.values()].filter((f) => f._field_type === FIELD);

  if (p.repr) {
    const flds = fieldList.filter((f) => f.repr);
    toAdd.push(['__repr__', new PyFunction({
      name: '__repr__',
      qualname: qual('__repr__'),
      params: [{ name: 'self' }],
      impl: ([self]) => {
        if (reprActive.has(self)) return '...';
        reprActive.add(self);
        try {
          return `${typeOf(self).qualname}(${flds.map((f) => `${f.name}=${repr(getattr(self, f.name))}`).join(', ')})`;
        } finally {
          reprActive.delete(self);
        }
      },
    }), false, false]);
  }

  if (eq) {
    const cmpFields = fieldList.filter((f) => f.compare);
    toAdd.push(['__eq__', new PyFunction({
      name: '__eq__',
      qualname: qual('__eq__'),
      params: [{ name: 'self' }, { name: 'other' }],
      impl: ([self, other]) => {
        if (self === other) return true;
        if (typeOf(other) === typeOf(self)) {
          let r = true;
          for (const f of cmpFields) {
            r = richcmp(getattr(self, f.name), getattr(other, f.name), 'eq');
            if (!truthy(r)) return r;
          }
          return r;
        }
        return NotImplemented;
      },
    }), false, false]);
  }

  if (order) {
    const flds = fieldList.filter((f) => f.compare);
    for (const op of ['lt', 'le', 'gt', 'ge']) {
      toAdd.push([DUNDER[op], new PyFunction({
        name: DUNDER[op],
        qualname: qual(DUNDER[op]),
        params: [{ name: 'self' }, { name: 'other' }],
        impl: ([self, other]) => {
          if (typeOf(other) === typeOf(self)) {
            return richcmp(new Tuple(fieldValues(self, flds)), new Tuple(fieldValues(other, flds)), op);
          }
          return NotImplemented;
        },
      }), 'Consider using functools.total_ordering', false]);
    }
  }

  if (frozen) {
    const names = new Set(fieldList.map((f) => f.name));
    toAdd.push(['__setattr__', new PyFunction({
      name: '__setattr__',
      qualname: qual('__setattr__'),
      params: [{ name: 'self' }, { name: 'name' }, { name: 'value' }],
      impl: ([self, name, value]) => {
        if (typeOf(self) === originalCls || names.has(name)) {
          raise('dataclasses.FrozenInstanceError', `cannot assign to field ${repr(name)}`);
        }
        const next = superLookup(originalCls, self, '__setattr__');
        if (next instanceof PyFunction) callFunction(next, [self, name, value], []);
        else genericSetattr(self, name, value);
        return null;
      },
    }), true, false]);
    toAdd.push(['__delattr__', new PyFunction({
      name: '__delattr__',
      qualname: qual('__delattr__'),
      params: [{ name: 'self' }, { name: 'name' }],
      impl: ([self, name]) => {
        if (typeOf(self) === originalCls || names.has(name)) {
          raise('dataclasses.FrozenInstanceError', `cannot delete field ${repr(name)}`);
        }
        const next = superLookup(originalCls, self, '__delattr__');
        if (next instanceof PyFunction) callFunction(next, [self, name], []);
        else genericSetattr(self, name, UNSET);
        return null;
      },
    }), true, false]);
  }

  // _hash_action[(unsafe_hash, eq, frozen, has_explicit_hash)]
  const uh = Boolean(p.unsafe_hash);
  const e = Boolean(eq);
  const fz = Boolean(frozen);
  let action = null;
  if (!uh && e && !fz && !hasExplicitHash) action = 'none';
  else if (!uh && e && fz && !hasExplicitHash) action = 'add';
  else if (uh && !hasExplicitHash) action = 'add';
  else if (uh && hasExplicitHash) action = 'exception';
  if (action === 'exception') raise('TypeError', `Cannot overwrite attribute __hash__ in class ${cls.name}`);
  if (action !== null) cls.dict.set('__hash__', null);
  if (action === 'add') {
    const flds = fieldList.filter((f) => (f.hash === null ? f.compare : truthy(f.hash)));
    const fn = new PyFunction({
      name: '__hash__',
      qualname: qual('__hash__'),
      params: [{ name: 'self' }],
      impl: ([self]) => hashOf(new Tuple(fieldValues(self, flds))),
    });
    fn.hashFields = flds.map((f) => f.name);
    toAdd.push(['__hash__', fn, false, true]);
  }

  // add_fns_to_class: CPython exec()s "def __create_fn__(<locals>): ..."
  // and calls it with **locals. The parser NFKC-normalizes identifiers in
  // that source text, the keyword names passed stay as they are — so a
  // field name that normalization changes (only possible through
  // make_dataclass) breaks the class: duplicate parameters are a
  // SyntaxError, otherwise the first changed keyword is "unexpected".
  checkCreateFn(fields, allInitFields, stdInitFields, kwOnlyInitFields, p, fields.has('self') ? '__dataclass_self__' : 'self');

  // add_fns_to_class
  for (const [name, fn, overwriteError, unconditional] of toAdd) {
    if (unconditional) cls.dict.set(name, fn);
    else {
      const exists = setNewAttribute(cls, name, fn);
      if (exists && overwriteError) {
        let msg = `Cannot overwrite attribute ${name} in class ${cls.name}`;
        if (overwriteError !== true) msg = `${msg} ${overwriteError}`;
        raise('TypeError', msg);
      }
    }
  }

  if (cls.dict.get('__doc__') === null) cls.dict.set('__doc__', new DocThunk(cls));

  if (p.match_args) setNewAttribute(cls, '__match_args__', new Tuple(stdInitFields.map((f) => f.name)));

  if (p.weakref_slot && !slots) raise('TypeError', 'weakref_slot is True but slots is False');
  if (slots) cls = addSlots(cls, frozen, p.weakref_slot);
  return cls;
}

const nfkc = (s) => s.normalize('NFKC');

function firstDuplicate(names) {
  const seen = new Set();
  for (const n of names) {
    if (seen.has(n)) return n;
    seen.add(n);
  }
  return null;
}

function checkCreateFn(fields, allInitFields, stdInitFields, kwOnlyInitFields, p, selfName) {
  const changed = [...fields.values()].some((f) => f._field_type !== FIELD_CLASSVAR && nfkc(f.name) !== f.name);
  if (!changed) return;
  // without __init__ the methods would read and write the normalized names
  if (!p.init) unpredictable('field names that NFKC normalization changes, with init=False');
  // _FuncBuilder.locals, in insertion order (_init_fn, __repr__, frozen)
  const locals = [];
  const add = (k) => { if (!locals.includes(k)) locals.push(k); };
  for (const f of allInitFields) add(`__dataclass_type_${f.name}__`);
  add('__dataclass_HAS_DEFAULT_FACTORY__');
  add('__dataclass_builtins_object__');
  for (const f of allInitFields) {
    const dflt = f.default_factory !== MISSING || (f.init && f.default !== MISSING) || (!f.init && p.slots && f.default !== MISSING);
    if (dflt) add(`__dataclass_dflt_${f.name}__`);
  }
  add('__dataclass___init___return_type__');
  if (p.repr) add('__dataclasses_recursive_repr');
  if (p.frozen) {
    add('cls');
    add('FrozenInstanceError');
  }
  const params = locals.map(nfkc);
  // symtable: __create_fn__'s own parameters first, then __init__'s
  let dup = firstDuplicate(params);
  if (dup === null) dup = firstDuplicate([selfName, ...stdInitFields.map((f) => f.name), ...kwOnlyInitFields.map((f) => f.name)].map(nfkc));
  if (dup !== null) raise('SyntaxError', `duplicate argument '${dup}' in function definition`);
  const bad = locals.find((k) => nfkc(k) !== k);
  if (bad !== undefined) {
    const sugg = calculateSuggestions(params, bad);
    raise('TypeError', `__create_fn__() got an unexpected keyword argument '${bad}'${sugg !== null ? `. Did you mean '${sugg}'?` : ''}`);
  }
  // an init=False field: the class is built, its methods use the normalized name
  unpredictable('field names that NFKC normalization changes');
}

// cls.__doc__ = cls.__name__ + str(inspect.signature(cls)).replace(' -> None', '')
// — computed when read (a default's repr may be unpredictable)
class DocThunk {
  constructor(cls) { this.cls = cls; }
  get value() {
    const init = this.cls.lookup('__init__');
    if (!init.found || init.value instanceof Opaque) return `${this.cls.name}()`;
    const fn = init.value;
    const parts = [];
    let starDone = false;
    for (const prm of fn.params.slice(1)) {
      if (prm.kwOnly && !starDone) { parts.push('*'); starDone = true; }
      let s = prm.name;
      const ann = fn.annotations ? fn.annotations.get(prm.name) : undefined;
      if (ann !== undefined) s += `: ${formatAnnotation(ann)}`;
      if (prm.default !== undefined) s += ann !== undefined ? ` = ${repr(prm.default)}` : `=${repr(prm.default)}`;
      parts.push(s);
    }
    return `${this.cls.name}(${parts.join(', ')})`;
  }
}

// inspect.formatannotation
function formatAnnotation(a) {
  if (a === ClassVar || a instanceof ClassVarAlias) return repr(a).replace(/[\w.]+/g, (t) => (t.startsWith('typing.') ? t.slice(7) : t));
  if (a instanceof GenericAlias) return repr(a);
  if (a instanceof PyClass) return a.module === 'builtins' ? a.qualname : `${a.module}.${a.qualname}`;
  return repr(a);
}

function getSlots(c) {
  const s = c.dict.has('__slots__') ? c.dict.get('__slots__') : undefined;
  if (s === undefined || s === null) {
    const out = [];
    if (c.weakrefable) out.push('__weakref__');
    if (c.hasDict) out.push('__dict__');
    return out;
  }
  if (typeof s === 'string') return [s];
  return iterate(s);
}

function addSlots(cls, isFrozen, weakrefSlot) {
  if (cls.dict.has('__slots__')) raise('TypeError', `${cls.name} already specifies __slots__`);
  const clsDict = new Map(cls.dict);
  const fieldNames = fields(cls).items.map((f) => f.name);
  const inherited = new Set(cls.mro.slice(1, -1).flatMap(getSlots));
  const slotNames = [...fieldNames, ...(weakrefSlot ? ['__weakref__'] : [])].filter((n) => !inherited.has(n));
  clsDict.set('__slots__', new Tuple(slotNames));
  for (const n of fieldNames) clsDict.delete(n);
  clsDict.delete('__dict__');
  clsDict.delete('__weakref__');
  const created = typeNew(cls.name, cls.bases, clsDict, cls.qualname);
  if (isFrozen) {
    if (!clsDict.has('__getstate__')) created.dict.set('__getstate__', new Opaque('_dataclass_getstate'));
    if (!clsDict.has('__setstate__')) created.dict.set('__setstate__', new Opaque('_dataclass_setstate'));
  }
  return created;
}

export function fields(classOrInstance) {
  let fm;
  try {
    fm = getattr(classOrInstance, '__dataclass_fields__');
  } catch (e) {
    if (excMatches(e, 'AttributeError')) raise('TypeError', 'must be called with a dataclass type or instance');
    throw e;
  }
  return new Tuple([...fm.values()].filter((f) => f._field_type === FIELD));
}

const isDataclassInstance = (obj) => typeOf(obj).lookup('__dataclass_fields__').found;

export function isDataclass(obj) {
  const cls = obj instanceof PyClass ? obj : typeOf(obj);
  return cls.lookup('__dataclass_fields__').found;
}

const isAtomic = (v) => v === null || v === undefined || typeof v === 'boolean' || typeof v === 'bigint'
  || typeof v === 'string' || v instanceof PyFloat || v instanceof PyClass || v instanceof PyFunction || v instanceof Builtin;

// asdict(obj, *, dict_factory=dict) — dictFactory: null for dict, else a
// callable receiving a list of (name, value) tuples
export function asdict(obj, dictFactory = null) {
  if (!isDataclassInstance(obj)) raise('TypeError', 'asdict() should be called on dataclass instances');
  return asdictInner(obj, dictFactory);
}

function asdictInner(obj, df) {
  if (isAtomic(obj)) return obj;
  if (isDataclassInstance(obj)) {
    if (df === null) return new Dict(fields(obj).items.map((f) => [f.name, asdictInner(getattr(obj, f.name), null)]));
    return callFunction(df, [fields(obj).items.map((f) => new Tuple([f.name, asdictInner(getattr(obj, f.name), df)]))], []);
  }
  if (Array.isArray(obj)) return obj.map((v) => asdictInner(v, df));
  if (obj instanceof Dict) return new Dict(obj.entries.map(([k, v]) => [asdictInner(k, df), asdictInner(v, df)]));
  if (obj instanceof Tuple) return new Tuple(obj.items.map((v) => asdictInner(v, df)));
  return deepcopy(obj);
}

export function astuple(obj, tupleFactory = null) {
  if (!isDataclassInstance(obj)) raise('TypeError', 'astuple() should be called on dataclass instances');
  return astupleInner(obj, tupleFactory);
}

function astupleInner(obj, tf) {
  if (isAtomic(obj)) return obj;
  if (isDataclassInstance(obj)) {
    const items = fields(obj).items.map((f) => astupleInner(getattr(obj, f.name), tf));
    return tf === null ? new Tuple(items) : callFunction(tf, [items], []);
  }
  if (Array.isArray(obj)) return obj.map((v) => astupleInner(v, tf));
  if (obj instanceof Tuple) return new Tuple(obj.items.map((v) => astupleInner(v, tf)));
  if (obj instanceof Dict) return new Dict(obj.entries.map(([k, v]) => [astupleInner(k, tf), astupleInner(v, tf)]));
  return deepcopy(obj);
}

// copy.deepcopy for this value model
export function deepcopy(x, memo = new Map()) {
  if (memo.has(x)) return memo.get(x);
  let y;
  if (isAtomic(x)) return x;
  if (Array.isArray(x)) {
    y = [];
    memo.set(x, y);
    for (const a of x) y.push(deepcopy(a, memo));
    return y;
  }
  if (x instanceof Tuple) {
    const items = x.items.map((a) => deepcopy(a, memo));
    if (memo.has(x)) return memo.get(x);
    y = items.some((v, i) => v !== x.items[i]) ? new Tuple(items) : x;
    memo.set(x, y);
    return y;
  }
  if (x instanceof Dict) {
    y = new Dict();
    memo.set(x, y);
    for (const [k, v] of x.entries) y.set(deepcopy(k, memo), deepcopy(v, memo));
    return y;
  }
  if (x instanceof PySet) {
    y = new PySet(x.items.map((a) => deepcopy(a, memo)));
    memo.set(x, y);
    return y;
  }
  if (x instanceof PyObj) {
    // __reduce_ex__(4) → copyreg.__newobj__(cls) + state, then _reconstruct
    const getstate = x.cls.lookup('__getstate__');
    if (getstate.found && getstate.value instanceof Opaque && getstate.value.label === '_dataclass_getstate') {
      // frozen + slots: state = [getattr(self, f.name) for f in fields(self)]
      const flds = fields(x).items;
      const state = flds.map((f) => getattr(x, f.name));
      y = new PyObj(x.cls);
      memo.set(x, y);
      const copied = deepcopy(state, memo);
      flds.forEach((f, i) => objectSetattr(y, f.name, copied[i])); // _dataclass_setstate
      return y;
    }
    y = new PyObj(x.cls);
    memo.set(x, y);
    // object.__getstate__: __dict__ (None when empty), plus set slots
    const dictState = x.dict && x.dict.size ? new Dict([...x.dict.entries()]) : null;
    const slotState = x.slots.size ? new Dict([...x.slots.entries()]) : null;
    let state = slotState ? new Tuple([dictState, slotState]) : dictState;
    if (state !== null) state = deepcopy(state, memo);
    let ds = state;
    let ss = null;
    if (state instanceof Tuple) [ds, ss] = state.items;
    if (ds) for (const [k, v] of ds.entries) y.dict.set(k, v);
    if (ss) for (const [k, v] of ss.entries) setattr(y, k, v);
    return y;
  }
  return unpredictable(`deepcopy of ${typeOf(x).name}`);
}

// replace(obj, /, **changes) and __replace__ — changes: [[name, value]]
export function replace(obj, changes = []) {
  if (!isDataclassInstance(obj)) raise('TypeError', 'replace() should be called on dataclass instances');
  return replaceImpl(obj, changes);
}

function replaceImpl(self, changes0) {
  const changes = new Map(changes0);
  for (const f of getattr(self, '__dataclass_fields__').values()) {
    if (f._field_type === FIELD_CLASSVAR) continue;
    if (!f.init) {
      if (changes.has(f.name)) raise('TypeError', `field ${f.name} is declared with init=False, it cannot be specified with replace()`);
      continue;
    }
    if (!changes.has(f.name)) {
      if (f._field_type === FIELD_INITVAR && f.default === MISSING) raise('TypeError', `InitVar ${pyStrRepr(f.name)} must be specified with replace()`);
      changes.set(f.name, getattr(self, f.name));
    }
  }
  return callClass(typeOf(self), [], [...changes.entries()]);
}

// _replace(self, /, **changes) — what __replace__ (copy.replace) calls
const REPLACE_FN = new PyFunction({
  name: '_replace',
  qualname: '_replace',
  params: [{ name: 'self' }],
  rawImpl: (args, kwargs) => {
    if (args.length !== 1) {
      raise('TypeError', args.length === 0
        ? "_replace() missing 1 required positional argument: 'self'"
        : `_replace() takes 1 positional argument but ${args.length} were given`);
    }
    return replaceImpl(args[0], kwargs);
  },
});

const KEYWORDS = new Set(['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']);
export const isIdentifier = (s) => /^[\p{XID_Start}_]\p{XID_Continue}*$/u.test(s);
export const isKeyword = (s) => KEYWORDS.has(s);

// make_dataclass(cls_name, fields, *, bases=(), namespace=None, …)
// items: str | Tuple/Array of 2 or 3 → name, type[, Field or default]
export function makeDataclass(clsName, items, { bases = [], namespace = [], module = '__main__', ...params } = {}) {
  const seen = new Set();
  const annotations = [];
  const defaults = new Map();
  for (const item of iterate(items)) {
    let name;
    let tp;
    if (typeof item === 'string') {
      name = item;
      tp = 'typing.Any';
    } else {
      const parts = item instanceof Tuple ? item.items : Array.isArray(item) ? item : null;
      if (parts === null) raise('TypeError', `object of type '${typeOf(item).name}' has no len()`);
      if (parts.length === 2) [name, tp] = parts;
      else if (parts.length === 3) {
        [name, tp] = parts;
        defaults.set(name, parts[2]);
      } else raise('TypeError', `Invalid field: ${repr(item)}`);
    }
    if (typeof name !== 'string' || !isIdentifier(name)) raise('TypeError', `Field names must be valid identifiers: ${repr(name)}`);
    if (isKeyword(name)) raise('TypeError', `Field names must not be keywords: ${repr(name)}`);
    if (seen.has(name)) raise('TypeError', `Field name duplicated: ${repr(name)}`);
    seen.add(name);
    annotations.push([name, tp]);
  }
  const ns = new Map();
  for (const [k, v] of namespace) ns.set(k, v);
  for (const [k, v] of defaults) ns.set(k, v);
  ns.set('__annotations__', new Map(annotations));
  ns.set('__module__', module);
  const cls = typeNew(clsName, bases.length ? bases : [OBJECT], ns, clsName);
  return dataclass(cls, params);
}

// match subject: case Cls(p0, p1, …) — the attribute values the positional
// sub-patterns are matched against, or null when isinstance fails
export function matchClassArgs(subject, cls, count) {
  if (!isInstance(subject, cls)) return null;
  if (count === 0) return [];
  const ma = cls.lookup('__match_args__');
  const names = ma.found ? ma.value : new Tuple([]);
  if (!(names instanceof Tuple)) raise('TypeError', `${cls.name}.__match_args__ must be a tuple (got ${typeOf(names).name})`);
  if (count > names.items.length) {
    raise('TypeError', `${cls.name}() accepts ${names.items.length} positional sub-pattern${names.items.length === 1 ? '' : 's'} (${count} given)`);
  }
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const n = names.items[i];
    if (!hasattr(subject, n)) return null;
    out.push(getattr(subject, n));
  }
  return out;
}

// ─── demo helpers ───────────────────────────────────────────

// The Python value of a demo number: the code shows JS number text, which
// CPython reads as an int ('7', '100000000000000000000') or a float
// ('1e+21'); 'inf' is a NameError, not a literal.
export function numLit(n, suggestion = "Did you mean: 'int'?") {
  const text = Number.isNaN(n) ? 'nan' : n === Infinity ? 'inf' : n === -Infinity ? '-inf' : String(n);
  if (text === 'inf' || text === '-inf' || text === 'nan') {
    raise('NameError', `name '${text.replace('-', '')}' is not defined${suggestion ? `. ${suggestion}` : ''}`);
  }
  if (/[.eE]/.test(text)) return new PyFloat(n);
  return BigInt(text);
}

// the float a 'float' demo input becomes (pyFloatRepr text read back)
export function floatLit(n, suggestion = "Did you mean: 'int'?") {
  if (!Number.isFinite(n)) {
    const text = Number.isNaN(n) ? 'nan' : 'inf';
    raise('NameError', `name '${text}' is not defined${suggestion ? `. ${suggestion}` : ''}`);
  }
  return new PyFloat(n);
}

// an 'auto' demo input: numbers as numLit reads them, text stays str
export const autoLit = (v, suggestion) => (typeof v === 'number' ? numLit(v, suggestion) : v);

// emulator return value → the demo's repr text
export const show = (v) => ({ __pyRaw: repr(v) });
