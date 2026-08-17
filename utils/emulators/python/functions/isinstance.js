// utils/emulators/python/isinstance.js
//
// Emulator for Python isinstance(object, classinfo). The demo takes a
// text value and a class name; we infer the value's Python type from its
// text form, then check whether the target class matches — including
// Python's subclass rules (notably that bool is a subclass of int).
//
// Supported class names in the demo: str, int, float, bool, list, dict,
// set, NoneType, bytes.

function inferType(x) {
  if (x === null || x === undefined) return 'NoneType';
  const s = String(x);
  if (s === '') return 'str';
  if (s === 'None') return 'NoneType';
  if (s === 'True' || s === 'False') return 'bool';
  if (/^-?\d+$/.test(s)) return 'int';
  const n = Number(s);
  if (Number.isFinite(n) && String(n) === s.trim()) {
    if (s.includes('.') || /[eE]/.test(s)) return 'float';
  }
  return 'str';
}

// Subclass relationships as Python defines them for common built-in types.
// bool is a subclass of int; every class is a subclass of object.
const PARENTS = {
  bool: ['int', 'object'],
  int:  ['object'],
  float:['object'],
  str:  ['object'],
  list: ['object'],
  dict: ['object'],
  set:  ['object'],
  bytes:['object'],
  NoneType: ['object'],
};

function isSubclass(child, target) {
  if (child === target) return true;
  const parents = PARENTS[child] || [];
  for (const p of parents) {
    if (p === target || isSubclass(p, target)) return true;
  }
  return false;
}

export default function pyIsInstance(x, cls) {
  const clsName = String(cls == null ? '' : cls).trim();
  if (!clsName) {
    throw new TypeError('isinstance() arg 2 must be a type, a tuple of types, or a union');
  }
  if (!(clsName in PARENTS)) {
    throw new TypeError('isinstance() arg 2 must be a type, a tuple of types, or a union');
  }
  const actual = inferType(x);
  return isSubclass(actual, clsName);
}