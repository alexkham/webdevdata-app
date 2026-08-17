// utils/emulators/python/float.js
//
// Emulator for Python float(x=0.0). Mirrors Python's string-parsing rules:
//   - No argument: 0.0
//   - Leading/trailing whitespace stripped
//   - Underscores allowed between digits (like Python 3.6+)
//   - "inf", "infinity", "nan" (case-insensitive) with optional sign
//   - Scientific notation
//   - Invalid strings raise ValueError with Python's wording
//   - Numbers pass through as-is (converted to number)

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

const INF_RE = /^[+-]?(inf|infinity)$/i;
const NAN_RE = /^[+-]?nan$/i;
const NUM_RE = /^[+-]?(\d(_?\d)*\.?(\d(_?\d)*)?|\.\d(_?\d)*)([eE][+-]?\d(_?\d)*)?$/;

export default function pyFloat(x) {
  if (x === undefined) return 0.0;
  if (typeof x === 'number') return x;
  if (typeof x === 'boolean') return x ? 1.0 : 0.0;

  const s = String(x).trim();
  if (s === '') {
    throw new ValueErrorLike("could not convert string to float: ''");
  }
  if (INF_RE.test(s)) {
    return s.startsWith('-') ? -Infinity : Infinity;
  }
  if (NAN_RE.test(s)) {
    return NaN;
  }
  if (!NUM_RE.test(s)) {
    throw new ValueErrorLike("could not convert string to float: '" + x + "'");
  }
  const parsed = Number(s.replace(/_/g, ''));
  if (Number.isNaN(parsed)) {
    throw new ValueErrorLike("could not convert string to float: '" + x + "'");
  }
  return parsed;
}