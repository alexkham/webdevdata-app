// utils/emulators/python/int.js
//
// Emulator for Python int(s, base=10) parsing a string: optional sign,
// optional matching 0x/0o/0b prefix, underscores between digits, digits
// validated against the base. Raises ValueError with Python's message on
// anything else — including '12.5' in base 10.

class ValueErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

const PREFIXES = { 16: '0x', 8: '0o', 2: '0b' };

export default function pyInt(s, base = 10) {
  if (typeof s !== 'string') throw new TypeError('int() argument must be str for this demo');
  let b = Math.trunc(Number(base));
  if (!Number.isFinite(b)) b = 10;
  if (b !== 0 && (b < 2 || b > 36)) {
    throw new ValueErrorLike('int() base must be >= 2 and <= 36, or 0');
  }

  const original = s;
  let t = s.trim();

  const invalid = () => {
    throw new ValueErrorLike(`invalid literal for int() with base ${b}: '${original}'`);
  };

  let sign = 1;
  if (t[0] === '+' || t[0] === '-') {
    if (t[0] === '-') sign = -1;
    t = t.slice(1);
  }

  // base 0: infer from prefix, like Python literals
  if (b === 0) {
    const p = t.slice(0, 2).toLowerCase();
    if (p === '0x') b = 16;
    else if (p === '0o') b = 8;
    else if (p === '0b') b = 2;
    else b = 10;
  }

  const prefix = PREFIXES[b];
  if (prefix && t.slice(0, 2).toLowerCase() === prefix) t = t.slice(2);

  // underscores allowed between digits only
  if (/^_|_$|__/.test(t)) invalid();
  t = t.replace(/_/g, '');
  if (t === '') invalid();

  for (const ch of t.toLowerCase()) {
    const digit = ch >= '0' && ch <= '9' ? ch.charCodeAt(0) - 48 : ch.charCodeAt(0) - 87;
    if (digit < 0 || digit >= b || (ch > '9' && (ch < 'a' || ch > 'z'))) invalid();
  }

  return sign * parseInt(t, b);
}
