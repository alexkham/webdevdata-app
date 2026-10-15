// utils/emulators/python/stdlib/enum/_pyenum.js
//
// A port of CPython 3.13 Lib/enum.py for the enum demos: EnumDict (the class
// body namespace: auto(), member()/nonmember(), _sunder_/__dunder__/private
// names, duplicate checks), EnumType.__new__ (members, aliases, flag masks,
// _order_, _ignore_, repr/str/format resolution), EnumType.__call__ (value
// lookup and the functional API), Enum.__new__ + Flag._missing_ (pseudo-
// members and the four FlagBoundary rules), the Flag operators, unique(),
// verify(), global_enum() and the reprs it installs.
//
// Python values used here:
//   int → bigint · bool → boolean · float → PyFloat · str → string
//   None → null · tuple → PyTuple · list → PyList
//   auto() → Auto · member(v) → MemberWrap · nonmember(v) → NonMember
//   enum members → EnumMember · enum classes → EnumClass
//
// State is kept exactly like CPython keeps it: pseudo-members created by a
// lookup are cached in the class's _value2member_map_, ~member results are
// cached on the member. Results therefore depend on the order of operations
// in the same way they do in CPython.
//
// Fuzzed against CPython 3.13 (see the enum section of the batch-4 report).

import { PyException } from '../../../../py-exceptions.js';
import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { fromLiteral } from '../../../../py-num.js';
import { formatInt, formatStr } from './_pyformat.js';

export const raise = (type, msg = '') => { throw new PyException(type, msg); };
// an input the port deliberately does not reproduce: SnippetDemo shows the
// "not emulated: …" message with a neutral label instead of a traceback
const unsupported = (what) => {
  const e = new Error(`not emulated: ${what} is outside what the in-browser demo reproduces`);
  e.name = 'DemoLimit';
  throw e;
};

// ── value model ──────────────────────────────────────────────
export class PyFloat { constructor(v) { this.v = v; } }
export class PyTuple { constructor(items) { this.items = items; } }
export class PyList { constructor(items) { this.items = items; } }
export const AUTO_NULL = Symbol('_auto_null');
export class Auto { constructor(value = AUTO_NULL) { this.value = value; } }
export class MemberWrap { constructor(value) { this.value = value; } }
export class NonMember { constructor(value) { this.value = value; } }
export const tuple = (...items) => new PyTuple(items);
export const float = (v) => new PyFloat(v);
export const auto = (v) => (v === undefined ? new Auto() : new Auto(v));

export class EnumMember {
  constructor(cls) {
    this.cls = cls;
    this._name_ = undefined;
    this._value_ = undefined;
    this._sort_order_ = undefined;
    this._inverted_ = null;
    this.data = undefined; // the int / str data of a mixed-in member
  }
  get name() { return this._name_ === undefined ? null : this._name_; }
  get value() { return this._value_; }
}

// A demo number (typed into a form) → the Python value its literal text is.
export function numArg(n) {
  const v = fromLiteral(n);
  return v.int !== undefined ? v.int : new PyFloat(v.float);
}
// 'auto' demo inputs arrive as JS number or string
export const autoArg = (x) => (typeof x === 'number' ? numArg(x) : x);

const isInt = (v) => typeof v === 'bigint' || typeof v === 'boolean';
const asBig = (v) => (typeof v === 'boolean' ? (v ? 1n : 0n) : v);
const isNum = (v) => isInt(v) || v instanceof PyFloat;
const isStr = (v) => typeof v === 'string';
const isHashable = (v) => {
  if (v instanceof PyList) return false;
  if (v instanceof PyTuple) return v.items.every(isHashable);
  return true;
};

export function typeName(v) {
  if (v === null) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (v instanceof PyFloat) return 'float';
  if (typeof v === 'string') return 'str';
  if (v instanceof PyTuple) return 'tuple';
  if (v instanceof PyList) return 'list';
  if (v instanceof EnumMember) return v.cls.name;
  if (v instanceof EnumClass) return v.isFlagClass() ? 'EnumType' : 'EnumType';
  if (v instanceof Auto) return 'auto';
  if (v instanceof MemberWrap) return 'member';
  if (v instanceof NonMember) return 'nonmember';
  if (v instanceof MappingProxy) return 'mappingproxy';
  return 'object';
}

export const bitLength = (n) => {
  let a = n < 0n ? -n : n;
  let len = 0;
  while (a > 0n) { a >>= 1n; len += 1; }
  return len;
};
const bitCount = (n) => {
  let a = n < 0n ? -n : n;
  let c = 0;
  while (a > 0n) { c += Number(a & 1n); a >>= 1n; }
  return c;
};
const isSingleBit = (n) => {
  if (n === 0n) return false;
  return (n & (n - 1n)) === 0n;
};
// enum._is_single_bit on any value: num == 0 → False; num &= num - 1
function isSingleBitPy(num) {
  if (isInt(num)) return isSingleBit(asBig(num));
  if (num instanceof PyFloat) {
    if (num.v === 0) return false;
    return raise('TypeError', "unsupported operand type(s) for &=: 'float' and 'float'");
  }
  return raise('TypeError', `unsupported operand type(s) for -: '${typeName(num)}' and 'int'`);
}
const pyHex = (n) => (n < 0n ? '-0x' + (-n).toString(16) : '0x' + n.toString(16));
const pyOct = (n) => (n < 0n ? '-0o' + (-n).toString(8) : '0o' + n.toString(8));
const pyBin = (n) => (n < 0n ? '-0b' + (-n).toString(2) : '0b' + n.toString(2));

// ── equality (dict-key semantics for the values above) ───────
function numCmpEq(a, b) {
  if (isInt(a) && isInt(b)) return asBig(a) === asBig(b);
  const x = isInt(a) ? asBig(a) : a.v;
  const y = isInt(b) ? asBig(b) : b.v;
  if (typeof x === 'number' && typeof y === 'number') return x === y;
  // int vs float: exact
  const f = typeof x === 'number' ? x : y;
  const i = typeof x === 'number' ? y : x;
  if (!Number.isFinite(f) || !Number.isInteger(f)) return false;
  return BigInt(f) === i;
}

// the int / str data a member compares with (int- or str-mixed members)
const memberData = (m) => (m.cls.memberType === 'object' ? undefined : m.data);

export function pyEq(a, b) {
  if (a === b) return true;
  if (a instanceof EnumMember || b instanceof EnumMember) {
    // members of mixed-in enums compare as their data (int.__eq__ / str.__eq__)
    const da = a instanceof EnumMember ? memberData(a) : a;
    const db = b instanceof EnumMember ? memberData(b) : b;
    if (da === undefined || db === undefined) return false;
    return pyEq(da, db);
  }
  if (isNum(a) && isNum(b)) return numCmpEq(a, b);
  if (isStr(a) && isStr(b)) return a === b;
  if (a instanceof PyTuple && b instanceof PyTuple) return a.items.length === b.items.length && a.items.every((x, i) => pyEq(x, b.items[i]));
  if (a instanceof PyList && b instanceof PyList) return a.items.length === b.items.length && a.items.every((x, i) => pyEq(x, b.items[i]));
  return false;
}

// hash equality for dict lookups: an Enum member (object-based) hashes by
// its name, int/str-mixed members hash as their data.
function sameKey(key, v) {
  if (key instanceof EnumMember && key.cls.memberType === 'object') return key === v;
  if (v instanceof EnumMember && v.cls.memberType === 'object') return key === v;
  return pyEq(key, v);
}

// An ordered dict keyed by Python values (value → member).
class ValueMap {
  constructor() { this.entries = []; }
  find(v) {
    if (!isHashable(v)) raise('TypeError', `unhashable type: '${typeName(v)}'`);
    for (const e of this.entries) if (sameKey(e[0], v)) return e;
    return null;
  }
  get(v) { const e = this.find(v); return e ? e[1] : undefined; }
  has(v) { return this.find(v) !== null; }
  setdefault(k, v) {
    const e = this.find(k);
    if (e) return e[1];
    this.entries.push([k, v]);
    return v;
  }
  set(k, v) {
    const e = this.find(k);
    if (e) e[1] = v; else this.entries.push([k, v]);
  }
}
const listContains = (list, v) => list.some((x) => x === v || pyEq(x, v));

// ── repr / str ───────────────────────────────────────────────
export function repr(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return v.toString();
  if (typeof v === 'number') return v.toString();
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  if (typeof v === 'string') return pyStrRepr(v);
  if (v instanceof PyTuple) {
    const items = v.items.map(repr);
    return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
  }
  if (v instanceof PyList) return '[' + v.items.map(repr).join(', ') + ']';
  if (Array.isArray(v)) return '[' + v.map(repr).join(', ') + ']';
  if (v instanceof EnumMember) return memberRepr(v);
  if (v instanceof EnumClass) return v.isFlagClass() ? `<flag ${pyStrRepr(v.name)}>` : `<enum ${pyStrRepr(v.name)}>`;
  if (v instanceof Auto) return `auto(${v.value === AUTO_NULL ? '_auto_null' : repr(v.value)})`;
  if (v instanceof MappingProxy) return 'mappingproxy({' + v.entries.map(([k, m]) => `${repr(k)}: ${repr(m)}`).join(', ') + '})';
  if (v && v.__pyRaw !== undefined) return v.__pyRaw;
  return unsupported(`repr of ${String(v)}`);
}

// str() of a plain value
export function str(v) {
  if (typeof v === 'string') return v;
  if (v instanceof EnumMember) return memberStr(v);
  return repr(v);
}

export class MappingProxy { constructor(entries) { this.entries = entries; } }

// ── classes ──────────────────────────────────────────────────
// Data types and object, for the MRO and method resolution.
const OBJECT = { kind: 'type', name: 'object', own: { __repr__: 'object.__repr__', __str__: 'object.__str__', __format__: 'object.__format__' }, bases: [] };
export const INT = { kind: 'type', name: 'int', own: { __repr__: 'int.__repr__', __format__: 'int.__format__' }, bases: [OBJECT] };
export const STR = { kind: 'type', name: 'str', own: { __repr__: 'str.__repr__', __str__: 'str.__str__', __format__: 'str.__format__' }, bases: [OBJECT] };
OBJECT.mro = [OBJECT];
INT.mro = [INT, OBJECT];
STR.mro = [STR, OBJECT];

function c3(cls, bases) {
  const seqs = bases.map((b) => [...b.mro]).concat([[...bases]]);
  const out = [cls];
  for (;;) {
    const nonEmpty = seqs.filter((s) => s.length > 0);
    if (nonEmpty.length === 0) return out;
    let head = null;
    for (const s of nonEmpty) {
      const cand = s[0];
      if (!nonEmpty.some((t) => t.indexOf(cand) > 0)) { head = cand; break; }
    }
    if (!head) raise('TypeError', 'Cannot create a consistent method resolution order (MRO)');
    out.push(head);
    for (const s of nonEmpty) if (s[0] === head) s.shift();
  }
}
const lookup = (cls, attr) => {
  for (const k of cls.mro) if (k.own && k.own[attr] !== undefined) return k.own[attr];
  return undefined;
};

export class EnumClass {
  constructor(name) {
    this.kind = 'enum';
    this.name = name;
    this.qualname = name;
    this.module = '__main__';
    this.own = {};
    this.memberNames = [];
    this.memberMap = new Map();
    this.value2member = new ValueMap();
    this.hashableValues = [];
    this.unhashableValues = [];
    this.unhashableValuesMap = new Map();
    this.memberType = 'object';
    this.gnv = null;
    this.missing = null; // classmethod _missing_ (JS function) or null → base's
    this.numericRepr = 'repr';
    this.boundary = null;
    this.flagMask = 0n;
    this.singlesMask = 0n;
    this.allBits = 0n;
    this.iterByDef = false;
    this.useArgs = false;
    this.newMember = 'object';
  }
  isSubclassOf(k) { return this.mro.includes(k); }
  isFlagClass() { return FLAG !== null && this.isSubclassOf(FLAG); }
  toString() { return repr(this); }
}

// _generate_next_value_ implementations
function gnvEnum(name, start, count, lastValues) {
  if (lastValues.length === 0) return start;
  let last;
  try { last = pySorted(lastValues).pop(); } catch (e) {
    if (e.name === 'TypeError') raise('TypeError', 'unable to sort non-numeric values');
    throw e;
  }
  try { return pyAdd(last, 1n); } catch (e) {
    if (e.name === 'TypeError') raise('TypeError', `unable to increment ${repr(last)}`);
    throw e;
  }
}
function gnvFlag(name, start, count, lastValues) {
  if (!count) return start !== null ? start : 1n;
  const last = pyMax(lastValues);
  let high;
  try {
    if (!isInt(last)) raise('AttributeError', '');
    high = bitLength(asBig(last)) - 1;
  } catch (e) {
    // 'invalid flag value %r' % last_value — a tuple is taken as the
    // argument tuple of the % operator itself
    if (last instanceof PyTuple) {
      if (last.items.length === 0) raise('TypeError', 'not enough arguments for format string');
      if (last.items.length > 1) raise('TypeError', 'not all arguments converted during string formatting');
      raise('TypeError', `invalid flag value ${repr(last.items[0])}`);
    }
    raise('TypeError', `invalid flag value ${repr(last)}`);
  }
  return 2n ** BigInt(high + 1);
}
const gnvLower = (name) => {
  if (!isStr(name)) raise('AttributeError', `'${typeName(name)}' object has no attribute 'lower'`);
  return name.toLowerCase();
};

// Python ordering for sort / min / max on the value types used here.
// op is '<' or '>'; the TypeError names the operands in the order compared.
function pyCmp(a, b, op) {
  if (isNum(a) && isNum(b)) return op === '<' ? numLt(a, b) : numLt(b, a);
  if (isStr(a) && isStr(b)) return op === '<' ? strLt(a, b) : strLt(b, a);
  if ((a instanceof PyTuple && b instanceof PyTuple) || (a instanceof PyList && b instanceof PyList)) {
    const n = Math.min(a.items.length, b.items.length);
    for (let i = 0; i < n; i++) {
      if (!pyEq(a.items[i], b.items[i])) return pyCmp(a.items[i], b.items[i], op);
    }
    return op === '<' ? a.items.length < b.items.length : a.items.length > b.items.length;
  }
  return raise('TypeError', `'${op}' not supported between instances of '${typeName(a)}' and '${typeName(b)}'`);
}
function numLt(a, b) {
  if (isInt(a) && isInt(b)) return asBig(a) < asBig(b);
  const x = isInt(a) ? asBig(a) : a.v;
  const y = isInt(b) ? asBig(b) : b.v;
  if (typeof x === 'number' && typeof y === 'number') return x < y;
  if (typeof x === 'number') { // float < int: x < y  <=>  floor(x) < y
    if (Number.isNaN(x) || x === Infinity) return false;
    if (x === -Infinity) return true;
    return BigInt(Math.floor(x)) < y;
  }
  // int < float: x < y  <=>  x < ceil(y)
  if (Number.isNaN(y) || y === -Infinity) return false;
  if (y === Infinity) return true;
  return x < BigInt(Math.ceil(y));
}
function strLt(a, b) {
  const x = Array.from(a, (c) => c.codePointAt(0));
  const y = Array.from(b, (c) => c.codePointAt(0));
  for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) return x[i] < y[i];
  return x.length < y.length;
}
const pyLt = (a, b) => pyCmp(a, b, '<');
// sorted(): CPython's list.sort compares with "<". Values here are few; an
// insertion sort gives the same order (callers only need the order, or
// replace a comparison TypeError with their own message).
function pySorted(values) {
  const a = [...values];
  for (let i = 1; i < a.length; i++) {
    const x = a[i];
    let j = i - 1;
    while (j >= 0 && pyLt(x, a[j])) { a[j + 1] = a[j]; j -= 1; }
    a[j + 1] = x;
  }
  return a;
}
// max() / min(): each new item is compared with the current best,
// item > best (max) or item < best (min)
function pyMax(values) {
  let best = values[0];
  for (let i = 1; i < values.length; i++) if (pyCmp(values[i], best, '>')) best = values[i];
  return best;
}
function pyMin(values) {
  let best = values[0];
  for (let i = 1; i < values.length; i++) if (pyCmp(values[i], best, '<')) best = values[i];
  return best;
}
function pyAdd(a, b) {
  if (isInt(a) && isInt(b)) return asBig(a) + asBig(b);
  if (isNum(a) && isNum(b)) {
    const x = isInt(a) ? Number(asBig(a)) : a.v;
    const y = isInt(b) ? Number(asBig(b)) : b.v;
    return new PyFloat(x + y);
  }
  return raise('TypeError', `unsupported operand type(s) for +: '${typeName(a)}' and '${typeName(b)}'`);
}

// ── the built-in enum classes ────────────────────────────────
let FLAG = null;
function baseClass(name, bases, setup) {
  const c = new EnumClass(name);
  c.module = 'enum';
  c.bases = bases;
  c.mro = c3(c, bases);
  setup(c);
  return c;
}
export const ENUM = baseClass('Enum', [OBJECT], (c) => {
  c.own = { __repr__: 'Enum.__repr__', __str__: 'Enum.__str__', __format__: 'Enum.__format__' };
  c.gnv = gnvEnum;
  c.firstEnum = null;
  c.isFlag = false;
});
export const REPR_ENUM = baseClass('ReprEnum', [ENUM], (c) => { c.gnv = gnvEnum; c.firstEnum = ENUM; c.isFlag = false; });
export const INT_ENUM = baseClass('IntEnum', [INT, REPR_ENUM], (c) => {
  c.own = { __repr__: 'Enum.__repr__', __str__: 'int.__repr__', __format__: 'int.__format__' };
  c.memberType = 'int'; c.gnv = gnvEnum; c.firstEnum = REPR_ENUM; c.newMember = 'int'; c.useArgs = true; c.isFlag = false;
});
export const STR_ENUM = baseClass('StrEnum', [STR, REPR_ENUM], (c) => {
  c.own = { __repr__: 'Enum.__repr__', __str__: 'str.__str__', __format__: 'str.__format__', __new__: 'StrEnum.__new__' };
  c.memberType = 'str'; c.gnv = gnvLower; c.firstEnum = REPR_ENUM; c.newMember = 'strenum'; c.useArgs = true; c.isFlag = false;
});
FLAG = baseClass('Flag', [ENUM], (c) => {
  c.own = { __repr__: 'Flag.__repr__', __str__: 'Flag.__str__' };
  c.gnv = gnvFlag; c.firstEnum = ENUM; c.boundary = 'strict'; c.isFlag = true;
});
export { FLAG };
export const INT_FLAG = baseClass('IntFlag', [INT, REPR_ENUM, FLAG], (c) => {
  c.own = { __repr__: 'Flag.__repr__', __str__: 'int.__repr__', __format__: 'int.__format__' };
  c.memberType = 'int'; c.gnv = gnvFlag; c.firstEnum = FLAG; c.boundary = 'keep'; c.newMember = 'int'; c.useArgs = true; c.isFlag = true;
});
// the boundary objects are FlagBoundary members; their repr when shown
export const BOUNDARIES = ['strict', 'conform', 'eject', 'keep'];

// ── EnumDict ─────────────────────────────────────────────────
const cpArr = (s) => Array.from(s);
export function isDunder(name) {
  const a = cpArr(name);
  return a.length > 4 && a[0] === '_' && a[1] === '_' && a[a.length - 1] === '_' && a[a.length - 2] === '_' && a[2] !== '_' && a[a.length - 3] !== '_';
}
export function isSunder(name) {
  const a = cpArr(name);
  return a.length > 2 && a[0] === '_' && a[a.length - 1] === '_' && a[1] !== '_' && a[a.length - 2] !== '_';
}
export function isPrivate(clsName, name) {
  const pattern = `_${clsName}__`;
  const a = cpArr(name);
  return a.length > cpArr(pattern).length && name.startsWith(pattern) && (a[a.length - 1] !== '_' || a[a.length - 2] !== '_');
}
const SUNDER_OK = ['_order_', '_generate_next_value_', '_numeric_repr_', '_missing_', '_ignore_',
  '_iter_member_', '_iter_member_by_value_', '_iter_member_by_def_', '_add_alias_', '_add_value_alias_'];

// str.split() with no argument: runs of the characters str.isspace() accepts
// (JS \s minus U+FEFF, plus U+001C–U+001F and U+0085)
const PY_SPACE = /[\t\n\v\f\r\u001c-\u001f \u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+/u;
export function pySplit(s) { return s.split(PY_SPACE).filter((x) => x !== ''); }
// str.replace(',', ' ').split() — split() on runs of Unicode whitespace
const namesFromString = (s) => pySplit(s.replace(/,/g, ' '));

export class EnumDict {
  constructor(clsName = null) {
    this.entries = new Map(); // key → value (insertion ordered)
    this._member_names = new Map();
    this._last_values = [];
    this._ignore = [];
    this._auto_called = false;
    this._cls_name = clsName;
    this._generate_next_value = undefined;
  }
  has(k) { return this.entries.has(k); }
  get(k) { return this.entries.get(k); }
  setitem(key, value) {
    if (typeof key !== 'string') unsupported('non-str EnumDict keys');
    if (this._cls_name !== null && isPrivate(this._cls_name, key)) {
      // a normal attribute
    } else if (isSunder(key)) {
      if (!SUNDER_OK.includes(key) && !key.startsWith('_repr_')) {
        raise('ValueError', `_sunder_ names, such as ${repr(key)}, are reserved for future Enum use`);
      }
      if (key === '_generate_next_value_') {
        if (this._auto_called) raise('TypeError', '_generate_next_value_ must be defined before members');
        this._generate_next_value = value;
      } else if (key === '_ignore_') {
        if (isStr(value)) value = namesFromString(value);
        else if (value instanceof PyList || value instanceof PyTuple) value = [...value.items];
        else if (Array.isArray(value)) value = [...value];
        else raise('TypeError', `'${typeName(value)}' object is not iterable`);
        this._ignore = value;
        const already = value.filter((v, i) => this._member_names.has(v) && value.indexOf(v) === i);
        if (already.length > 1) unsupported('several already-set _ignore_ names (set order)');
        if (already.length) raise('ValueError', `_ignore_ cannot specify already set names: {${repr(already[0])}}`);
        value = new PyList(value);
      }
    } else if (isDunder(key)) {
      if (key === '__order__') key = '_order_';
    } else if (this._member_names.has(key)) {
      raise('TypeError', `${repr(key)} already defined as ${repr(this.entries.get(key))}`);
    } else if (this._ignore.includes(key)) {
      // ignored
    } else if (value instanceof NonMember) {
      value = value.value;
    } else {
      if (this.entries.has(key)) raise('TypeError', `${repr(key)} already defined as ${repr(this.entries.get(key))}`);
      if (value instanceof MemberWrap) value = value.value;
      let nonAutoStore = true;
      let single = false;
      if (value instanceof Auto) { single = true; value = new PyTuple([value]); }
      if (value instanceof PyTuple && value.items.some((v) => v instanceof Auto)) {
        const autoValued = [];
        for (let v of value.items) {
          if (v instanceof Auto) {
            nonAutoStore = false;
            if (v.value === AUTO_NULL) {
              if (this._generate_next_value === undefined) raise('AttributeError', "'EnumDict' object has no attribute '_generate_next_value'");
              v.value = this._generate_next_value(key, 1n, this._member_names.size, [...this._last_values]);
              this._auto_called = true;
            }
            v = v.value;
            this._last_values.push(v);
          }
          autoValued.push(v);
        }
        value = single ? autoValued[0] : new PyTuple(autoValued);
      }
      this._member_names.set(key, null);
      if (nonAutoStore) this._last_values.push(value);
    }
    this.entries.set(key, value);
  }
  get member_names() { return [...this._member_names.keys()]; }
  update(pairs) { for (const [k, v] of pairs) this.setitem(k, v); }
}

// ── data-type constructors used for mixed-in members ─────────
function intFromStr(s, base = 10) {
  const bad = () => raise('ValueError', `invalid literal for int() with base ${base}: ${pyStrRepr(s)}`);
  let t = s.replace(/^[\s\u001c-\u001f\u0085]+|[\s\u001c-\u001f\u0085]+$/gu, '');
  let neg = false;
  if (t[0] === '+' || t[0] === '-') { neg = t[0] === '-'; t = t.slice(1); }
  let b = base;
  if (b === 0) {
    if (/^0[xX]/.test(t)) { b = 16; t = t.slice(2); if (t[0] === '_') t = t.slice(1); } else if (/^0[oO]/.test(t)) { b = 8; t = t.slice(2); if (t[0] === '_') t = t.slice(1); } else if (/^0[bB]/.test(t)) { b = 2; t = t.slice(2); if (t[0] === '_') t = t.slice(1); } else {
      b = 10;
      if (/^0+(_?0)*$/.test(t)) return 0n;
      if (/^0/.test(t)) bad();
    }
  } else if ((b === 16 && /^0[xX]/.test(t)) || (b === 8 && /^0[oO]/.test(t)) || (b === 2 && /^0[bB]/.test(t))) {
    t = t.slice(2); if (t[0] === '_') t = t.slice(1);
  }
  if (t === '' || t[0] === '_' || t[t.length - 1] === '_' || t.includes('__')) bad();
  t = t.replace(/_/g, '');
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, b);
  let n = 0n;
  for (const ch of t.toLowerCase()) {
    const d = digits.indexOf(ch);
    if (d < 0) bad();
    n = n * BigInt(b) + BigInt(d);
  }
  return neg ? -n : n;
}
// int(*args)
function pyIntCall(args) {
  if (args.length === 0) return 0n;
  if (args.length > 2) raise('TypeError', `int() takes at most 2 arguments (${args.length} given)`);
  const x = args[0];
  if (args.length === 2) {
    const base = args[1];
    if (!isInt(base)) raise('TypeError', `'${typeName(base)}' object cannot be interpreted as an integer`);
    const b = asBig(base);
    if (b !== 0n && (b < 2n || b > 36n)) {
      if (b > 9223372036854775807n || b < -9223372036854775808n) raise('OverflowError', 'Python int too large to convert to C ssize_t');
      raise('ValueError', 'int() base must be >= 2 and <= 36, or 0');
    }
    if (!isStr(x)) raise('TypeError', "int() can't convert non-string with explicit base");
    if (/[^\x00-\x7f]/.test(x)) unsupported('int() of non-ASCII text');
    return intFromStr(x, Number(b));
  }
  if (isInt(x)) return asBig(x);
  if (x instanceof PyFloat) {
    if (Number.isNaN(x.v)) raise('ValueError', 'cannot convert float NaN to integer');
    if (!Number.isFinite(x.v)) raise('OverflowError', 'cannot convert float infinity to integer');
    return BigInt(Math.trunc(x.v));
  }
  if (isStr(x)) {
    if (/[^\x00-\x7f]/.test(x)) unsupported('int() of non-ASCII text');
    return intFromStr(x, 10);
  }
  return raise('TypeError', `int() argument must be a string, a bytes-like object or a real number, not '${typeName(x)}'`);
}
// str(*args)
function pyStrCall(args) {
  if (args.length === 0) return '';
  if (args.length > 3) raise('TypeError', `str() takes at most 3 arguments (${args.length} given)`);
  if (args.length === 1) return str(args[0]);
  if (args.length >= 2 && !isStr(args[1])) raise('TypeError', `str() argument 'encoding' must be str, not ${typeName(args[1])}`);
  if (args.length === 3 && !isStr(args[2])) raise('TypeError', `str() argument 'errors' must be str, not ${typeName(args[2])}`);
  if (isStr(args[0])) raise('TypeError', 'decoding str is not supported');
  return raise('TypeError', `decoding to str: need a bytes-like object, ${typeName(args[0])} found`);
}
// StrEnum.__new__(cls, *values)
function strEnumNew(values) {
  if (values.length > 3) raise('TypeError', `too many arguments for str(): ${repr(new PyTuple(values))}`);
  if (values.length === 1 && !isStr(values[0])) raise('TypeError', `${repr(values[0])} is not a string`);
  if (values.length >= 2 && !isStr(values[1])) raise('TypeError', `encoding must be a string, not ${repr(values[1])}`);
  if (values.length === 3 && !isStr(values[2])) {
    const v = values[2];
    if (v instanceof PyTuple && v.items.length !== 1) raise('TypeError', v.items.length === 0 ? 'not enough arguments for format string' : 'not all arguments converted during string formatting');
    raise('TypeError', `errors must be a string, not ${repr(v instanceof PyTuple ? v.items[0] : v)}`);
  }
  return pyStrCall(values);
}

// ── class creation (EnumType.__prepare__ + __new__) ──────────
function findDataType(clsName, bases) {
  const dataTypes = [];
  for (const chain of bases) {
    let candidate = null;
    for (const base of chain.mro) {
      if (base === OBJECT) continue;
      if (base instanceof EnumClass) {
        if (base.memberType !== 'object') { if (!dataTypes.includes(base.memberType)) dataTypes.push(base.memberType); break; }
      } else if (base === INT || base === STR) {
        const t = (candidate || base) === INT ? 'int' : 'str';
        if (!dataTypes.includes(t)) dataTypes.push(t);
        break;
      } else candidate = candidate || base;
    }
  }
  if (dataTypes.length > 1) unsupported('several data types');
  return dataTypes[0] || 'object';
}
function getMixins(clsName, bases) {
  if (bases.length === 0) return ['object', ENUM];
  const firstEnum = bases[bases.length - 1];
  if (!(firstEnum instanceof EnumClass)) raise('TypeError', 'new enumerations should be created as `EnumName([mixin_type, ...] [data_type,] enum_type)`');
  return [findDataType(clsName, bases), firstEnum];
}

// prepare(name, bases) → EnumDict with the inherited _generate_next_value_
export function prepare(name, bases) {
  for (const chain of bases) {
    for (const base of chain.mro) {
      if (base instanceof EnumClass && base.memberNames.length) {
        raise('TypeError', `<enum ${repr(name)}> cannot extend ${repr(base)}`);
      }
    }
  }
  const d = new EnumDict(name);
  const [, firstEnum] = getMixins(name, bases);
  if (firstEnum) d.setitem('_generate_next_value_', firstEnum.gnv);
  return d;
}

// The body of a class statement: [key, value] pairs, in order. Values are
// Python values, Auto / MemberWrap / NonMember, or for the special names:
//   _generate_next_value_: JS function(name, start, count, lastValues)
//   _missing_:             JS function(cls, value) → member | null
//   _numeric_repr_:        'repr' | 'hex' | 'oct' | 'bin'
//   __str__ / __repr__ / __format__: a method tag ('object.__str__', …)
// opts: { boundary: 'strict' | 'conform' | 'eject' | 'keep', module, qualname }
export function defineEnum(name, bases, body = [], opts = {}) {
  const classdict = prepare(name, bases);
  for (const [k, v] of body) classdict.setitem(k, v);
  return newEnum(name, bases, classdict, opts);
}

function newEnum(name, bases, classdict, opts = {}) {
  // _ignore_
  if (!classdict.has('_ignore_')) classdict.entries.set('_ignore_', new PyList([]));
  const ignore = classdict.get('_ignore_');
  if (!(ignore instanceof PyList)) unsupported('_ignore_ of this type');
  ignore.items.push('_ignore_');
  for (const key of ignore.items) classdict.entries.delete(key);
  const memberNames = classdict.member_names;
  const invalid = memberNames.filter((n) => n === 'mro' || n === '');
  if (invalid.length > 1) unsupported('both invalid names (set order)');
  if (invalid.length) raise('ValueError', `invalid enum member name(s) ${repr(invalid[0])}`);
  let order = classdict.has('_order_') ? classdict.get('_order_') : null;
  classdict.entries.delete('_order_');
  const gnvEntry = classdict.get('_generate_next_value_');

  const [memberType, firstEnum] = getMixins(name, bases);
  const cls = new EnumClass(name);
  cls.bases = bases;
  cls.mro = c3(cls, bases);
  // __module__ / __qualname__ set in the class body win
  cls.module = classdict.has('__module__') ? classdict.get('__module__') : (opts.module || '__main__');
  cls.qualname = classdict.has('__qualname__') ? classdict.get('__qualname__') : (opts.qualname || name);
  cls.memberType = memberType;
  cls.firstEnum = firstEnum;
  cls.gnv = gnvEntry !== undefined && gnvEntry !== null ? gnvEntry : firstEnum.gnv;
  for (const k of ['__repr__', '__str__', '__format__', '__reduce_ex__']) if (classdict.has(k)) cls.own[k] = classdict.get(k);
  if (classdict.has('_missing_')) cls.missing = classdict.get('_missing_');
  else cls.missing = inheritedMissing(cls);
  if (classdict.has('_numeric_repr_')) cls.numericRepr = classdict.get('_numeric_repr_');
  else cls.numericRepr = inheritedNumericRepr(cls);
  // _find_new_: the __new__ that creates members
  const strEnumNewFound = cls.mro.some((k) => k.own && k.own.__new__ === 'StrEnum.__new__');
  if (strEnumNewFound) { cls.newMember = 'strenum'; cls.useArgs = true; } else if (memberType === 'int') { cls.newMember = 'int'; cls.useArgs = true; } else if (memberType === 'str') { cls.newMember = 'str'; cls.useArgs = true; } else { cls.newMember = 'object'; cls.useArgs = false; }
  cls.isFlag = cls.isFlagClass();
  cls.boundary = opts.boundary || firstEnum.boundary || null;
  cls.flagMask = 0n; cls.singlesMask = 0n; cls.allBits = 0n;
  cls.inProgress = true;

  // __dunder__ names with plain values (the functional API puts every name
  // it is given into the class namespace): type.__new__ checks __slots__,
  // then __qualname__, then __classcell__ before any member exists
  if (classdict.has('__slots__')) {
    const slots = classdict.get('__slots__');
    if (isStr(slots)) {
      if (slots !== '__slots__') unsupported(`__slots__ = ${repr(slots)}`);
      raise('ValueError', `${repr(slots)} in __slots__ conflicts with class variable`);
    }
    if (isNum(slots)) raise('TypeError', `'${typeName(slots)}' object is not iterable`);
    unsupported('__slots__ of this type');
  }
  if (classdict.has('__qualname__') && !isStr(classdict.get('__qualname__'))) {
    raise('TypeError', `type __qualname__ must be a str, not ${typeName(classdict.get('__qualname__'))}`);
  }
  if (classdict.has('__classcell__')) {
    raise('TypeError', `__classcell__ must be a nonlocal cell, not <class '${typeName(classdict.get('__classcell__'))}'>`);
  }
  // methods the creation of every member calls: a plain value there is
  // "not callable" as soon as the first member is made (__getattr__ only
  // runs while _value_ is still unset, i.e. unless StrEnum.__new__ set it)
  for (const k of ['__new__', '__getattribute__', '__getattr__', '__setattr__', '__init__']) {
    if (!classdict.has(k) || memberNames.length === 0) continue;
    if (k === '__getattr__' && cls.newMember === 'strenum') continue;
    raise('TypeError', `'${typeName(classdict.get(k))}' object is not callable`);
  }
  // a plain value as __class__ breaks Enum.__repr__ (self.__class__._value_repr_)
  if (classdict.has('__class__')) cls.classOverride = classdict.get('__class__');

  // plain class attributes: what the body set that is not a member and not
  // a _sunder_ / __dunder__ name (nonmember() values, private names, …)
  cls.attrs = new Map();
  for (const [k, v] of classdict.entries) {
    if (!memberNames.includes(k) && !isSunder(k) && !isDunder(k)) cls.attrs.set(k, v);
  }
  // members: _proto_member.__set_name__ in definition order
  for (const memberName of memberNames) {
    const value0 = classdict.get(memberName);
    createMember(cls, memberName, value0);
  }
  cls.inProgress = false;

  // ReprEnum directly in the bases: keep the data type's str() and format()
  if (bases.includes(REPR_ENUM)) {
    if (memberType === 'object') raise('TypeError', 'ReprEnum subclasses must be mixed with a data type (i.e. int, str, float, etc.)');
    if (!('__format__' in cls.own)) cls.own.__format__ = memberType === 'int' ? 'int.__format__' : 'str.__format__';
    if (!('__str__' in cls.own)) cls.own.__str__ = memberType === 'int' ? 'int.__repr__' : 'str.__str__';
  }
  const dataType = memberType === 'int' ? INT : memberType === 'str' ? STR : OBJECT;
  for (const m of ['__repr__', '__str__', '__format__']) {
    if (m in cls.own) continue;
    const enumMethod = lookup(firstEnum, m);
    const found = lookup(cls, m);
    if (found === lookup(dataType, m) || found === OBJECT.own[m]) cls.own[m] = enumMethod;
  }

  // _order_: a str is split into names; any other value is used as given —
  // `if _order_:` tests its truth, the list comprehensions iterate it
  if (typeof order === 'string') order = namesFromString(order);
  const orderGiven = () => order !== null && (Array.isArray(order) ? order.length > 0 : truthy(order));
  const orderItems = () => {
    let items;
    if (Array.isArray(order)) items = order;
    else if (order instanceof PyList || order instanceof PyTuple) items = [...order.items];
    else raise('TypeError', `'${typeName(order)}' object is not iterable`);
    for (const o of items) if (!isHashable(o)) raise('TypeError', `unhashable type: '${typeName(o)}'`);
    return items;
  };
  const inMap = (o) => typeof o === 'string' && cls.memberMap.has(o);
  if (cls.isFlag) {
    const memberList = memberNames.length ? cls.memberNames.map((n) => cls.memberMap.get(n)._value_) : [];
    const sorted = pySorted(memberList);
    if (memberList.some((v, i) => !pyEq(v, sorted[i]))) cls.iterByDef = true;
    if (orderGiven()) {
      order = orderItems().filter((o) => !inMap(o) || isSingleBitPy(cls.memberMap.get(o)._value_));
    }
  } else {
    cls.boundary = null;
  }
  if (orderGiven()) {
    order = orderItems().filter((o) => !inMap(o) || cls.memberNames.includes(o));
    if (order.length !== cls.memberNames.length || order.some((o, i) => o !== cls.memberNames[i])) {
      raise('TypeError', `member order does not match _order_:\n  ${repr(cls.memberNames)}\n  ${repr(order)}`);
    }
  }
  return cls;
}
function inheritedMissing(cls) {
  for (const k of cls.mro) if (k instanceof EnumClass && k !== cls && k.missing) return k.missing;
  return null;
}
function inheritedNumericRepr(cls) {
  for (const k of cls.mro) if (k instanceof EnumClass && k !== cls) return k.numericRepr;
  return 'repr';
}

function createMember(cls, memberName, value) {
  const args = value instanceof PyTuple ? value.items : [value];
  const m = new EnumMember(cls);
  if (cls.useArgs) {
    if (cls.newMember === 'int') { m.data = pyIntCall(args); } else if (cls.newMember === 'str') { m.data = pyStrCall(args); } else if (cls.newMember === 'strenum') { m.data = strEnumNew(args); m._value_ = m.data; }
  }
  if (m._value_ === undefined) {
    if (cls.memberType === 'object') m._value_ = value;
    else m._value_ = cls.memberType === 'int' ? pyIntCall(args) : pyStrCall(args);
  }
  value = m._value_;
  m._name_ = memberName;
  m._sort_order_ = cls.memberNames.length;
  if (cls.isFlag) {
    if (isInt(value)) {
      cls.flagMask |= asBig(value);
      if (isSingleBit(asBig(value))) cls.singlesMask |= asBig(value);
    }
    cls.allBits = 2n ** BigInt(bitLength(cls.flagMask)) - 1n;
  }
  let enumMember = m;
  let found = null;
  if (isHashable(value)) {
    found = cls.value2member.get(value);
  } else {
    for (const [, canonical] of cls.memberMap) {
      if (pyEq(canonical._value_, value)) { found = canonical; break; }
    }
  }
  if (found) enumMember = found;
  else if (!cls.isFlag) cls.memberNames.push(memberName);
  else if (isInt(value) && isSingleBit(asBig(value))) cls.memberNames.push(memberName);
  addMember(cls, memberName, enumMember);
  if (isHashable(value)) {
    cls.value2member.setdefault(value, enumMember);
    if (!listContains(cls.hashableValues, value)) cls.hashableValues.push(value);
  } else {
    cls.unhashableValues.push(value);
    if (!cls.unhashableValuesMap.has(memberName)) cls.unhashableValuesMap.set(memberName, []);
    cls.unhashableValuesMap.get(memberName).push(value);
  }
}
function addMember(cls, name, member) {
  if (cls.memberMap.has(name)) {
    if (cls.memberMap.get(name) !== member) raise('NameError', `${repr(name)} is already bound: ${repr(cls.memberMap.get(name))}`);
    return;
  }
  cls.memberMap.set(name, member);
}

// ── functional API: EnumType.__call__ on a class without members ─
// names: a str, an array of str, an array of [name, value] pairs, or a Map.
export function functional(base, className, names, { start = 1n, type = null, boundary = null, module = '__main__' } = {}) {
  const bases = type ? [type, base] : [base];
  const [, firstEnum] = getMixins(className, bases);
  const classdict = prepare(className, bases);
  let items = names;
  if (isStr(items)) items = namesFromString(items);
  if (Array.isArray(items) && items.length && isStr(items[0])) {
    const original = items;
    items = [];
    const lastValues = [];
    original.forEach((n, count) => {
      const value = firstEnum.gnv(n, start, count, [...lastValues]);
      lastValues.push(value);
      items.push([n, value]);
    });
  }
  if (items === null || items === undefined) items = [];
  if (items instanceof Map) items = [...items.entries()];
  for (const [k, v] of items) classdict.setitem(k, v);
  // _create_ sets __module__ after the names (a '__module__' name loses)
  classdict.entries.set('__module__', module);
  return newEnum(className, bases, classdict, { boundary, module });
}

// EnumType.__call__(cls, value, *values)
export function call(cls, value, ...more) {
  if (cls.memberMap.size === 0) {
    if (more.length === 0) raise('TypeError', `${repr(cls)} has no members; specify \`names=()\` if you meant to create a new, empty, enum`);
    return functional(cls, value, more[0]);
  }
  if (more.length) value = new PyTuple([value, ...more]);
  return enumNew(cls, value);
}

// Enum.__new__ — the by-value lookup
export function enumNew(cls, value) {
  if (value instanceof EnumMember && value.cls === cls) return value;
  if (isHashable(value)) {
    const hit = cls.value2member.get(value);
    if (hit !== undefined) return hit;
  } else {
    for (const [name, vals] of cls.unhashableValuesMap) if (listContains(vals, value)) return cls.memberMap.get(name);
    for (const [name, member] of cls.memberMap) if (pyEq(value, member._value_)) return cls.memberMap.get(name);
  }
  if (cls.memberMap.size === 0) {
    if (cls.inProgress) raise('TypeError', 'do not use `super().__new__; call the appropriate __new__ directly');
    raise('TypeError', `${repr(cls)} has no members defined`);
  }
  let exc = null;
  let result = null;
  try {
    if (cls.missing && typeof cls.missing !== 'function') raise('TypeError', `'${typeName(cls.missing)}' object is not callable`);
    result = cls.missing ? cls.missing(cls, value) : null;
  } catch (e) {
    if (!(e instanceof PyException)) throw e;
    exc = e;
    result = null;
  }
  if (result instanceof EnumMember && result.cls.isSubclassOf(cls)) return result;
  if (cls.isFlag && cls.boundary === 'eject' && isInt(result)) return result;
  if (result === null && exc === null) raise('ValueError', `${repr(value)} is not a valid ${cls.qualname}`);
  if (exc === null) exc = new PyException('TypeError', `error in ${cls.name}._missing_: returned ${repr(result)} instead of None or a valid member`);
  throw exc;
}

// enum.bin(num, max_bits=None)
export function enumBin(num, maxBits = null) {
  const ceiling = 2n ** BigInt(bitLength(num));
  let s;
  if (num >= 0n) s = pyBin(num + ceiling).replace('1', '0');
  else s = pyBin(~num ^ ((ceiling - 1n) + ceiling));
  const sign = s.slice(0, 3);
  let digits = s.slice(3);
  if (maxBits !== null && digits.length < maxBits) {
    digits = (sign[sign.length - 1].repeat(maxBits) + digits).slice(-maxBits);
  }
  return `${sign} ${digits}`;
}

const numericRepr = (cls, n) => {
  if (cls.numericRepr === 'hex') return pyHex(n);
  if (cls.numericRepr === 'oct') return pyOct(n);
  if (cls.numericRepr === 'bin') return pyBin(n);
  return n.toString();
};

function* iterBitsLsb(num) {
  const original = num;
  if (num instanceof EnumMember) num = num._value_;
  if (!isInt(num)) {
    if (num instanceof PyFloat) {
      // num < 0 → ValueError; while num: → 0.0 yields nothing; ~num fails
      if (num.v < 0) raise('ValueError', `${repr(original)} is not a positive integer`);
      if (num.v === 0) return;
      raise('TypeError', "bad operand type for unary ~: 'float'");
    }
    raise('TypeError', `'<' not supported between instances of '${typeName(num)}' and 'int'`);
  }
  num = asBig(num);
  if (num < 0n) raise('ValueError', `${repr(original)} is not a positive integer`);
  while (num) {
    const b = num & (~num + 1n);
    yield b;
    num ^= b;
  }
}
export const showFlagValues = (value) => [...iterBitsLsb(value)];

function iterMemberByValue(cls, value) {
  if (!isInt(value)) raise('TypeError', `unsupported operand type(s) for &: '${typeName(value)}' and 'int'`);
  const out = [];
  for (const val of iterBitsLsb(asBig(value) & cls.flagMask)) {
    const m = cls.value2member.get(val);
    out.push(m === undefined ? null : m);
  }
  return out;
}
function iterMember(cls, value) {
  const byValue = iterMemberByValue(cls, value);
  if (!cls.iterByDef) return byValue;
  for (const m of byValue) {
    if (m === null) raise('AttributeError', "'NoneType' object has no attribute '_sort_order_'");
    if (m._sort_order_ === undefined) raise('AttributeError', `'${m.cls.name}' object has no attribute '_sort_order_'`);
  }
  // sorted() is stable
  return byValue.map((m, i) => [m, i]).sort((a, b) => (a[0]._sort_order_ - b[0]._sort_order_) || (a[1] - b[1])).map((x) => x[0]);
}

// Flag._missing_
function flagMissing(cls, value) {
  if (!isInt(value)) raise('ValueError', `${repr(value)} is not a valid ${cls.qualname}`);
  // a bool stays a bool until an operation turns it into an int (it shows
  // in the STRICT message, is what EJECT hands back, and becomes _value_)
  const original = value;
  let unchanged = true;
  value = asBig(value);
  const flagMask = cls.flagMask;
  const singlesMask = cls.singlesMask;
  const allBits = cls.allBits;
  let negValue = null;
  if (!(~allBits <= value && value <= allBits) || (value & (allBits ^ flagMask))) {
    if (cls.boundary === 'strict') {
      const maxBits = Math.max(bitLength(value), bitLength(flagMask));
      raise('ValueError', `${repr(cls)} invalid value ${repr(original)}\n    given ${enumBin(value, maxBits)}\n  allowed ${enumBin(flagMask, maxBits)}`);
    } else if (cls.boundary === 'conform') {
      value &= flagMask;
      unchanged = false;
    } else if (cls.boundary === 'eject') {
      return original;
    } else if (cls.boundary === 'keep') {
      if (value < 0n) {
        const a = allBits + 1n;
        const b = 2n ** BigInt(bitLength(value));
        value = (a > b ? a : b) + value;
        unchanged = false;
      }
    } else {
      raise('ValueError', `${repr(cls)} unknown flag boundary ${repr(cls.boundary)}`);
    }
  }
  if (value < 0n) {
    negValue = value;
    value = allBits + 1n + value;
    unchanged = false;
  }
  let unknown = value & ~flagMask;
  const aliases = value & ~singlesMask;
  const memberValue = value & singlesMask;
  if (unknown && cls.boundary !== 'keep') {
    raise('ValueError', `${cls.name}(${unchanged ? repr(original) : value}) -->  unknown values ${unknown} [${pyBin(unknown)}]`);
  }
  let pseudo = new EnumMember(cls);
  pseudo._value_ = unchanged ? original : value;
  if (cls.memberType === 'int') pseudo.data = value;
  if (memberValue || aliases) {
    const members = [];
    let combined = 0n;
    for (const m of iterMember(cls, memberValue)) {
      members.push(m);
      combined |= asBig(m._value_);
    }
    let v = value;
    if (aliases) {
      v = memberValue | aliases;
      for (const [, pm] of cls.memberMap) {
        if (members.includes(pm) || !truthy(pm._value_)) continue;
        if (!isInt(pm._value_)) raise('TypeError', `unsupported operand type(s) for &: '${typeName(pm._value_)}' and 'int'`);
        if ((asBig(pm._value_) & v) === asBig(pm._value_)) {
          members.push(pm);
          combined |= asBig(pm._value_);
        }
      }
    }
    unknown = v ^ combined;
    pseudo._name_ = members.map((m) => m._name_).join('|');
    if (!combined) pseudo._name_ = null;
    else if (unknown && cls.boundary === 'strict') raise('ValueError', `${repr(cls)}: no members with value ${unknown}`);
    else if (unknown) pseudo._name_ += '|' + numericRepr(cls, unknown);
    value = v;
  } else {
    pseudo._name_ = null;
  }
  pseudo = cls.value2member.setdefault(value, pseudo);
  if (negValue !== null) cls.value2member.set(negValue, pseudo);
  return pseudo;
}
FLAG.missing = flagMissing;

// ── member behaviour ─────────────────────────────────────────
// _value_repr_: the data type's __repr__ (int.__repr__ shows a bool
// _value_ — possible on a pseudo-member — as 1 / 0), else repr()
function vrepr(m) {
  const v = m._value_;
  if (m.cls.memberType === 'int' && typeof v === 'boolean') return v ? '1' : '0';
  return repr(v);
}
const REPR_TAGS = ['Enum.__repr__', 'Flag.__repr__', 'global_enum_repr', 'global_flag_repr', 'int.__repr__', 'str.__repr__'];
export function memberRepr(m) {
  const how = lookup(m.cls, '__repr__');
  const cls = m.cls;
  const name = m._name_;
  if (!REPR_TAGS.includes(how)) {
    // a plain value assigned to __repr__ (functional API names)
    if (isInt(how) || how instanceof PyFloat || isStr(how)) raise('TypeError', `'${typeName(how)}' object is not callable`);
    return unsupported(`__repr__ ${how}`);
  }
  if (cls.classOverride !== undefined && how === 'Enum.__repr__') {
    raise('AttributeError', `'${typeName(cls.classOverride)}' object has no attribute '_value_repr_'`);
  }
  if (cls.classOverride !== undefined) unsupported('__class__ in the class namespace');
  switch (how) {
    case 'Enum.__repr__': return `<${cls.name}.${name === null ? 'None' : name}: ${vrepr(m)}>`;
    case 'Flag.__repr__': return name === null || name === undefined ? `<${cls.name}: ${vrepr(m)}>` : `<${cls.name}.${name}: ${vrepr(m)}>`;
    case 'global_enum_repr': return `${cls.module.split('.').pop()}.${name}`;
    case 'global_flag_repr': return globalFlagRepr(m);
    case 'int.__repr__': return m.data.toString();
    case 'str.__repr__': return pyStrRepr(m.data);
    default: return unsupported(`__repr__ ${how}`);
  }
}
function globalFlagRepr(m) {
  const cls = m.cls;
  const module = cls.module.split('.').pop();
  if (m._name_ === null || m._name_ === undefined) return `${module}.${cls.name}(${repr(m._value_)})`;
  if (isSingleBitPy(m._value_)) return `${module}.${m._name_}`;
  if (cls.boundary !== 'keep') return m._name_.split('|').map((n) => `${module}.${n}`).join('|');
  return m._name_.split('|').map((n) => (/^\p{Nd}/u.test(n) ? n : `${module}.${n}`)).join('|');
}
export function memberStr(m) {
  const how = lookup(m.cls, '__str__');
  const cls = m.cls;
  switch (how) {
    case 'Enum.__str__': return `${cls.name}.${m._name_ === null ? 'None' : m._name_}`;
    case 'Flag.__str__': return m._name_ === null || m._name_ === undefined ? `${cls.name}(${repr(m._value_)})` : `${cls.name}.${m._name_}`;
    case 'int.__repr__': return m.data.toString();
    case 'str.__str__': return m.data;
    case 'object.__str__': return memberRepr(m);
    case 'global_str': return m._name_ === null || m._name_ === undefined ? `${cls.name}(${repr(m._value_)})` : m._name_;
    default: return unsupported(`__str__ ${how}`);
  }
}
// format(member, spec) → a str, or the member itself (str.__format__ hands
// back a str subclass unchanged when the spec changes nothing)
export function memberFormat(m, spec) {
  const how = lookup(m.cls, '__format__');
  switch (how) {
    case 'Enum.__format__': return formatStr(memberStr(m), spec, 'str');
    case 'int.__format__': return formatInt(m.data, spec, m.cls.name, () => memberStr(m));
    case 'str.__format__': return formatStr(m.data, spec, m.cls.name, m, () => memberStr(m));
    default: return unsupported(`__format__ ${how}`);
  }
}
// format() of any value used in the demos
export function format(v, spec) {
  if (v instanceof EnumMember) return memberFormat(v, spec);
  if (isStr(v)) return formatStr(v, spec, 'str');
  if (typeof v === 'bigint') return formatInt(v, spec, 'int');
  return unsupported(`format of ${typeName(v)}`);
}

export function truthy(v) {
  if (v instanceof EnumMember) {
    if (v.cls.isFlag) return truthy(v._value_);
    if (v.cls.memberType === 'int') return v.data !== 0n;
    if (v.cls.memberType === 'str') return v.data !== '';
    return true;
  }
  if (v === null) return false;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'bigint') return v !== 0n;
  if (v instanceof PyFloat) return v.v !== 0;
  if (isStr(v)) return v !== '';
  if (v instanceof PyTuple || v instanceof PyList) return v.items.length > 0;
  return true;
}

// ── class-level API ──────────────────────────────────────────
export const members = (cls) => cls.memberNames.map((n) => cls.memberMap.get(n));
export const reversedMembers = (cls) => members(cls).reverse();
export const length = (cls) => cls.memberNames.length;
export const membersProxy = (cls) => new MappingProxy([...cls.memberMap.entries()]);
export function getitem(cls, name) {
  if (!isHashable(name)) raise('TypeError', `unhashable type: '${typeName(name)}'`);
  if (isStr(name) && cls.memberMap.has(name)) return cls.memberMap.get(name);
  return raise('KeyError', repr(name));
}
// Cls.attr for the names a demo reads: a member (members are class
// attributes, also when named name / value), a plain attribute the body
// defined, or the AttributeError. Inherited methods are not modelled.
export function classAttr(cls, name) {
  if (cls.memberMap.has(name)) return cls.memberMap.get(name);
  if (cls.attrs && cls.attrs.has(name)) return cls.attrs.get(name);
  if (name === 'name' || name === 'value') raise('AttributeError', `${repr(cls)} has no attribute ${repr(name)}`);
  if (name.startsWith('_')) unsupported(`class attribute ${name}`);
  return raise('AttributeError', `type object ${repr(cls.name)} has no attribute ${repr(name)}`);
}
// EnumType.__contains__
export function contains(cls, value) {
  if (value instanceof EnumMember && value.cls.isSubclassOf(cls)) return true;
  try {
    call(cls, value);
    return true;
  } catch (e) {
    if (!(e instanceof PyException) || e.name !== 'ValueError') throw e;
    return listContains(cls.unhashableValues, value) || listContains(cls.hashableValues, value);
  }
}

// ── Flag operators ───────────────────────────────────────────
const NOT_IMPLEMENTED = Symbol('NotImplemented');
function getValue(self, flag) {
  if (flag instanceof EnumMember && flag.cls.isSubclassOf(self.cls)) return flag._value_;
  if (self.cls.memberType === 'int' && flag instanceof EnumMember && flag.cls.memberType === 'int') unsupported('IntFlag ops across classes');
  if (self.cls.memberType === 'int' && isInt(flag)) return flag;
  return NOT_IMPLEMENTED;
}
const OPS = { '|': (a, b) => a | b, '&': (a, b) => a & b, '^': (a, b) => a ^ b };
// Flag.__or__ / __and__ / __xor__ (and the reflected forms, which are the
// same functions): NOT_IMPLEMENTED when `other` is not usable.
function flagMethod(self, op, other) {
  const otherValue = getValue(self, other);
  if (otherValue === NOT_IMPLEMENTED) return NOT_IMPLEMENTED;
  for (const flag of [self, other]) {
    if (getValue(self, flag) === null) raise('TypeError', `'${str(flag)}' cannot be combined with other flags with ${op}`);
  }
  const sv = self._value_;
  if (!isInt(sv) || !isInt(otherValue)) {
    raise('TypeError', `unsupported operand type(s) for ${op}: '${typeName(sv)}' and '${typeName(otherValue)}'`);
  }
  return call(self.cls, OPS[op](asBig(sv), asBig(otherValue)));
}
const isFlagMember = (x) => x instanceof EnumMember && x.cls.isFlag;
// a OP b for the operands the demos use: Flag / IntFlag members and ints.
export function flagOp(a, op, b) {
  const fail = () => raise('TypeError', `unsupported operand type(s) for ${op}: '${typeName(a)}' and '${typeName(b)}'`);
  if (typeof a === 'boolean' || typeof b === 'boolean') unsupported('bool operands');
  if (isFlagMember(a)) {
    let r = flagMethod(a, op, b);
    if (r !== NOT_IMPLEMENTED) return r;
    // reflected method of the right operand (another class only)
    if (isFlagMember(b) && b.cls !== a.cls) {
      r = flagMethod(b, op, a);
      if (r !== NOT_IMPLEMENTED) return r;
    }
    return fail();
  }
  if (isFlagMember(b)) {
    if (typeof a === 'bigint' && b.cls.memberType === 'int') {
      // an int subclass with __ror__ on the right is asked first
      return flagMethod(b, op, a);
    }
    // a.__or__(b) is NotImplemented, then b.__ror__(a)
    const r = flagMethod(b, op, a);
    return r !== NOT_IMPLEMENTED ? r : fail();
  }
  if (typeof a === 'bigint' && typeof b === 'bigint') return OPS[op](a, b);
  return unsupported('operands without a Flag member');
}
export function invert(m) {
  if (!(m instanceof EnumMember) || !m.cls.isFlag) {
    if (m instanceof EnumMember && m.cls.memberType === 'int') return ~m.data;
    if (isInt(m)) return ~asBig(m);
    return raise('TypeError', `bad operand type for unary ~: '${typeName(m)}'`);
  }
  if (getValue(m, m) === null) raise('TypeError', `'${str(m)}' cannot be inverted`);
  if (m._inverted_ === null) {
    if (!isInt(m._value_)) raise('TypeError', `bad operand type for unary ~: '${typeName(m._value_)}'`);
    const v = asBig(m._value_);
    if (m.cls.boundary === 'eject' || m.cls.boundary === 'keep') m._inverted_ = call(m.cls, ~v);
    else m._inverted_ = call(m.cls, m.cls.singlesMask & ~v);
  }
  return m._inverted_;
}
// `other in flag` (Flag.__contains__)
export function flagContains(flag, other) {
  if (!(flag instanceof EnumMember)) raise('TypeError', `argument of type '${typeName(flag)}' is not iterable`);
  if (!flag.cls.isFlag) unsupported('in on a non-flag member');
  if (!(other instanceof EnumMember && other.cls.isSubclassOf(flag.cls))) {
    raise('TypeError', `unsupported operand type(s) for 'in': ${repr(other instanceof EnumMember ? other.cls.qualname : typeName(other))} and ${repr(flag.cls.qualname)}`);
  }
  const ov = other._value_;
  const fv = flag._value_;
  if (!isInt(ov) || !isInt(fv)) raise('TypeError', `unsupported operand type(s) for &: '${typeName(ov)}' and '${typeName(fv)}'`);
  return (asBig(ov) & asBig(fv)) === asBig(ov);
}
export function flagIter(m) {
  if (!(m instanceof EnumMember)) raise('TypeError', `'${typeName(m)}' object is not iterable`);
  if (!m.cls.isFlag) raise('TypeError', `'${m.cls.name}' object is not iterable`);
  return iterMember(m.cls, m._value_);
}
// member.name / member.value (AttributeError for what an EJECT lookup returns)
export function attr(m, name) {
  if (!(m instanceof EnumMember)) raise('AttributeError', `'${typeName(m)}' object has no attribute '${name}'`);
  return name === 'name' ? m.name : m.value;
}
// list(flag): list() asks len() first (a non-TypeError from __len__
// propagates), then iterates
export function flagList(m) {
  try { flagLen(m); } catch (e) {
    if (!(e instanceof PyException) || e.name !== 'TypeError') throw e;
  }
  return flagIter(m);
}
export function flagLen(m) {
  if (!(m instanceof EnumMember)) raise('TypeError', `object of type '${typeName(m)}' has no len()`);
  if (!isInt(m._value_)) raise('AttributeError', `'${typeName(m._value_)}' object has no attribute 'bit_count'`);
  return BigInt(bitCount(asBig(m._value_)));
}

// member.__reduce_ex__(proto) — what pickle stores for a member:
// Enum.__reduce_ex__ (the class and the value), or the module-level
// helpers a class can install: __reduce_ex__ = pickle_by_enum_name /
// pickle_by_global_name ('pickle_by_…' tags in the class body)
const BUILTIN_GETATTR = { __pyRaw: '<built-in function getattr>' };
export function reduceEx(m) {
  const how = lookup(m.cls, '__reduce_ex__');
  if (how === 'pickle_by_global_name') return m.name;
  if (how === 'pickle_by_enum_name') return new PyTuple([BUILTIN_GETATTR, new PyTuple([m.cls, m.name])]);
  return new PyTuple([m.cls, new PyTuple([m._value_])]);
}

// ── decorators ───────────────────────────────────────────────
export function unique(cls) {
  const dups = [];
  for (const [name, member] of cls.memberMap) if (name !== member._name_) dups.push(`${name} -> ${member._name_}`);
  if (dups.length) raise('ValueError', `duplicate values found in ${repr(cls)}: ${dups.join(', ')}`);
  return cls;
}

// verify(*checks)(cls); checks: 'UNIQUE' | 'CONTINUOUS' | 'NAMED_FLAGS'
export function verify(cls, ...checks) {
  const clsName = cls.name;
  const enumType = cls.isFlag ? 'flag' : 'enum';
  for (const check of checks) {
    if (check === 'UNIQUE') {
      const dups = [];
      for (const [name, member] of cls.memberMap) if (name !== member._name_) dups.push(`${name} -> ${member._name_}`);
      if (dups.length) raise('ValueError', `aliases found in ${repr(cls)}: ${dups.join(', ')}`);
    } else if (check === 'CONTINUOUS') {
      const values = [];
      for (const m of members(cls)) if (!listContains(values, m._value_)) values.push(m._value_);
      if (values.length < 2) continue;
      if (!values.every(isNum)) unsupported('CONTINUOUS on non-numbers (set order)');
      const low = pyMin(values);
      const high = pyMax(values);
      const missing = [];
      let text = '';
      const head = `invalid ${enumType} ${repr(clsName)}: missing values `;
      const add = (m) => {
        missing.push(m);
        text = text ? `${text}, ${m}` : `${m}`;
        return head.length + text.length > 256;
      };
      if (enumType === 'flag') {
        // only canonical (single-bit int) values are here
        const hb = (v) => bitLength(asBig(v)) - 1;
        for (let i = hb(low) + 1; i < hb(high); i++) {
          const p = 2n ** BigInt(i);
          if (!listContains(values, p) && add(p)) break;
        }
      } else {
        if (low instanceof PyFloat || high instanceof PyFloat) raise('TypeError', "'float' object cannot be interpreted as an integer");
        // range(low+1, high) — the message is cut at 256 characters, so
        // stop as soon as it is long enough. CPython first builds the list
        // of every missing value: for a huge gap that takes very long or
        // ends in MemoryError, so the demo stops instead of guessing.
        if (asBig(high) - asBig(low) > 1000000n) {
          raise('DemoLimit', 'the browser demo stops here: CPython would first list every missing value (over a million of them) before cutting the message to 256 characters');
        }
        for (let i = asBig(low) + 1n; i < asBig(high); i++) {
          if (!listContains(values, i) && add(i)) break;
        }
      }
      if (missing.length) raise('ValueError', (head + text).slice(0, 256));
    } else if (check === 'NAMED_FLAGS') {
      const memberValues = members(cls).map((m) => m._value_);
      const missingNames = [];
      let missingValue = 0n;
      for (const [name, alias] of cls.memberMap) {
        if (cls.memberNames.includes(name)) continue;
        if (!isNum(alias._value_)) raise('TypeError', `'<' not supported between instances of '${typeName(alias._value_)}' and 'int'`);
        if (pyLt(alias._value_, 0n)) continue;
        const bits = [...iterBitsLsb(alias._value_)];
        const missed = bits.filter((v) => !listContains(memberValues, v));
        if (missed.length) {
          missingNames.push(name);
          for (const v of missed) missingValue |= v;
        }
      }
      if (missingNames.length) {
        const alias = missingNames.length === 1
          ? `alias ${missingNames[0]} is missing`
          : `aliases ${missingNames.slice(0, -1).join(', ')} and ${missingNames[missingNames.length - 1]} are missing`;
        const value = isSingleBit(missingValue) ? `value 0x${missingValue.toString(16)}` : `combined values of 0x${missingValue.toString(16)}`;
        raise('ValueError', `invalid Flag ${repr(clsName)}: ${alias} ${value} [use enum.show_flag_values(value) for details]`);
      }
    }
  }
  return cls;
}

// global_enum(cls, update_str=False) — the repr/str changes only (the
// export of the members into the module namespace has no browser analogue)
export function globalEnum(cls, updateStr = false) {
  cls.own.__repr__ = cls.isFlag ? 'global_flag_repr' : 'global_enum_repr';
  if (!cls.isSubclassOf(REPR_ENUM) || updateStr) cls.own.__str__ = 'global_str';
  return cls;
}

// re.RegexFlag, built the way Lib/re/__init__.py builds it
// (@global_enum @_simple_enum(IntFlag, boundary=KEEP), __str__ = object.__str__,
// _numeric_repr_ = hex). Values from re._constants.
export function makeRegexFlag() {
  const body = [
    ['NOFLAG', 0n], ['ASCII', 256n], ['A', 256n], ['IGNORECASE', 2n], ['I', 2n], ['LOCALE', 4n], ['L', 4n],
    ['UNICODE', 32n], ['U', 32n], ['MULTILINE', 8n], ['M', 8n], ['DOTALL', 16n], ['S', 16n],
    ['VERBOSE', 64n], ['X', 64n], ['DEBUG', 128n],
    ['__str__', 'object.__str__'], ['_numeric_repr_', 'hex'],
  ];
  return globalEnum(defineEnum('RegexFlag', [INT_FLAG], body, { boundary: 'keep', module: 're' }));
}

// ── demo output ──────────────────────────────────────────────
// Any engine value → what pyReprExact prints for it
export const py = (v) => ({ __pyRaw: repr(v) });
export const pyTuple = (...items) => ({ __pyRaw: repr(new PyTuple(items)) });
