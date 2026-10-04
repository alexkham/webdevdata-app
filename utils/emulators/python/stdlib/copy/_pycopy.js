// utils/emulators/python/stdlib/copy/_pycopy.js
//
// Port of CPython 3.13's Lib/copy.py over a small object model with real
// identity — shared by the copy hub and every member emulator. Not a
// content page (leading underscore), so the catalog generator never maps it.
//
//   copy()      _copy_dispatch: atomic types and tuples return the SAME
//               object; list.copy / dict.copy make a new outer container
//               that shares every item
//   deepcopy()  memo keyed by object identity; _deepcopy_list/_dict put the
//               new container in the memo BEFORE copying the items (so
//               cycles and shared references are reproduced);
//               _deepcopy_tuple returns the original tuple when no item
//               changed, and checks the memo after copying the items
//   replace()   obj.__replace__(**changes) for the namedtuple and frozen
//               dataclass models; TypeError "replace() does not support
//               <type> objects" otherwise
//   repr()      list / tuple / dict repr with the "[...]" / "{...}" marker
//               for self-references (Py_ReprEnter)
//
// Value model (shared with the json/itertools ports): None → null, bool,
// int → bigint, float → PyFloat, str → string, list → Array (identity =
// the JS array), tuple → { __pyTuple }, dict → PyDict, plus NamedTuple and
// DataclassObj below.

import { PyException } from '../../../../py-exceptions.js';
import { PyFloat, PyDict, pyValRepr } from '../json/_pyjson.js';
import { pyNum } from '../itertools/_pyitertools.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

export { PyFloat, PyDict };

export const raise = (type, msg = '') => { throw new PyException(type, msg); };

export const tuple = (...items) => ({ __pyTuple: items });
const isTuple = (v) => v !== null && typeof v === 'object' && Array.isArray(v.__pyTuple);

// collections.namedtuple instance: Point(x=1, y=2)
export class NamedTuple {
  constructor(typename, fields, values) {
    Object.assign(this, { typename, fields, values });
  }
  // namedtuple._replace / __replace__
  replace(changes) {
    const kw = new Map(changes);
    const values = this.fields.map((f, i) => {
      if (kw.has(f)) { const v = kw.get(f); kw.delete(f); return v; }
      return this.values[i];
    });
    if (kw.size) raise('TypeError', `Got unexpected field names: ${repr([...kw.keys()])}`);
    return new NamedTuple(this.typename, this.fields, values);
  }
}

// @dataclass(frozen=True) instance with plain fields: Item(name='pen', qty=3)
export class DataclassObj {
  constructor(cls, fields, values) {
    Object.assign(this, { cls, fields, values });
  }
  // dataclasses._replace: self.__class__(**{every init field, then changes})
  replace(changes) {
    const kw = new Map(this.fields.map((f, i) => [f, this.values[i]]));
    for (const [k, v] of changes) {
      if (!this.fields.includes(k)) raise('TypeError', `${this.cls}.__init__() got an unexpected keyword argument ${pyStrRepr(k)}`);
      kw.set(k, v);
    }
    return new DataclassObj(this.cls, this.fields, this.fields.map((f) => kw.get(f)));
  }
}

export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (v instanceof PyFloat) return 'float';
  if (typeof v === 'string') return 'str';
  if (Array.isArray(v)) return 'list';
  if (isTuple(v)) return 'tuple';
  if (v instanceof PyDict) return 'dict';
  if (v instanceof NamedTuple) return v.typename;
  if (v instanceof DataclassObj) return v.cls;
  return 'object';
}

const isAtomic = (v) => v === null || v === undefined || typeof v === 'boolean' || typeof v === 'bigint'
  || typeof v === 'string' || v instanceof PyFloat;

// ─── copy.copy ──────────────────────────────────────────────

export function copy(x) {
  if (isAtomic(x) || isTuple(x)) return x;          // _copy_immutable
  if (Array.isArray(x)) return x.slice();           // list.copy
  if (x instanceof PyDict) return new PyDict(x.entries.map(([k, v]) => [k, v])); // dict.copy
  if (x instanceof NamedTuple) return new NamedTuple(x.typename, x.fields, x.values.slice()); // __reduce_ex__ → cls(*values)
  if (x instanceof DataclassObj) return new DataclassObj(x.cls, x.fields, x.values.slice()); // __reduce_ex__ + __dict__ state
  return raise('TypeError', `cannot pickle '${typeName(x)}' object`);
}

// ─── copy.deepcopy ──────────────────────────────────────────

export function deepcopy(x, memo = null) {
  let m = memo;
  if (m === null) m = new Map();
  else if (m.has(x)) return m.get(x);
  let y;
  if (isAtomic(x)) y = x;
  else if (Array.isArray(x)) {
    y = [];
    m.set(x, y);
    for (const a of x) y.push(deepcopy(a, m));
  } else if (isTuple(x)) {
    const items = x.__pyTuple.map((a) => deepcopy(a, m));
    if (m.has(x)) return m.get(x);
    y = items.some((v, i) => v !== x.__pyTuple[i]) ? tuple(...items) : x;
  } else if (x instanceof PyDict) {
    y = new PyDict();
    m.set(x, y);
    for (const [k, v] of x.entries) {
      const kk = deepcopy(k, m);
      y.set(kk, deepcopy(v, m));
    }
  } else if (x instanceof NamedTuple) {
    y = new NamedTuple(x.typename, x.fields, x.values.map((v) => deepcopy(v, m)));
  } else if (x instanceof DataclassObj) {
    y = new DataclassObj(x.cls, x.fields, []);
    m.set(x, y);
    y.values = x.values.map((v) => deepcopy(v, m));
  } else raise('TypeError', `cannot pickle '${typeName(x)}' object`);
  if (y !== x) m.set(x, y);
  return y;
}

// ─── copy.replace (3.13) ────────────────────────────────────

// changes: [[name, value], …] in keyword order
export function replace(obj, changes = []) {
  if (obj instanceof NamedTuple || obj instanceof DataclassObj) return obj.replace(changes);
  return raise('TypeError', `replace() does not support ${typeName(obj)} objects`);
}

// ─── repr with self-reference markers ───────────────────────

export function repr(v, active = new Set()) {
  if (isAtomic(v)) return pyValRepr(v);
  if (Array.isArray(v)) {
    if (active.has(v)) return '[...]';
    active.add(v);
    const s = '[' + v.map((x) => repr(x, active)).join(', ') + ']';
    active.delete(v);
    return s;
  }
  if (isTuple(v)) {
    if (active.has(v)) return '(...)';
    active.add(v);
    const items = v.__pyTuple.map((x) => repr(x, active));
    active.delete(v);
    return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
  }
  if (v instanceof PyDict) {
    if (active.has(v)) return '{...}';
    active.add(v);
    const s = '{' + v.entries.map(([k, x]) => `${repr(k, active)}: ${repr(x, active)}`).join(', ') + '}';
    active.delete(v);
    return s;
  }
  if (v instanceof NamedTuple) {
    if (active.has(v)) return '...';
    active.add(v);
    const s = `${v.typename}(${v.fields.map((f, i) => `${f}=${repr(v.values[i], active)}`).join(', ')})`;
    active.delete(v);
    return s;
  }
  if (v instanceof DataclassObj) {
    if (active.has(v)) return '...';
    active.add(v);
    const s = `${v.cls}(${v.fields.map((f, i) => `${f}=${repr(v.values[i], active)}`).join(', ')})`;
    active.delete(v);
    return s;
  }
  return String(v);
}

export const show = (v) => ({ __pyRaw: repr(v) });

// typed numbers → Python values
export const nums = (xs) => xs.map(pyNum);
export const num = (n) => pyNum(n);
