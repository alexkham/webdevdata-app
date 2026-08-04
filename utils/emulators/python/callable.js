// utils/emulators/python/callable.js
//
// Emulator for Python callable(object). The demo takes a text input and
// infers what it refers to — a type, a builtin function, or a literal
// value — then reports callability.
//
// Callable in Python:
//   - types (str, int, list, ...): calling constructs an instance
//   - built-in functions (print, len, ...): obviously callable
//   - user functions, lambdas, methods: callable
//   - class instances with __call__: callable
//
// Not callable:
//   - int/float/str/bool/None VALUES (unless the class defines __call__)

const CALLABLE_NAMES = new Set([
  // Types (constructors)
  'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'bytes',
  'frozenset', 'complex', 'range', 'type', 'object', 'Exception',
  // Built-in functions
  'print', 'len', 'abs', 'all', 'any', 'sum', 'min', 'max', 'sorted',
  'reversed', 'enumerate', 'zip', 'map', 'filter', 'iter', 'next',
  'repr', 'hash', 'id', 'callable', 'isinstance', 'hasattr', 'getattr',
  'setattr', 'delattr', 'chr', 'ord', 'hex', 'bin', 'oct', 'pow',
  'round', 'divmod', 'format', 'input',
]);

function inferKind(x) {
  if (x === null || x === undefined) return 'value';
  const s = String(x).trim();
  if (s === '') return 'value';
  if (s === 'None') return 'value';
  if (s === 'True' || s === 'False') return 'value';
  if (/^-?\d+$/.test(s)) return 'value';
  const n = Number(s);
  if (Number.isFinite(n) && String(n) === s) {
    if (s.includes('.') || /[eE]/.test(s)) return 'value';
  }
  if (CALLABLE_NAMES.has(s)) return 'callable';
  return 'value';
}

export default function pyCallable(x) {
  return inferKind(x) === 'callable';
}