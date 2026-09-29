// utils/emulators/python/exceptions/arithmeticerror.js
//
// Emulator for the ArithmeticError demo modes. Integers are BigInt so any
// length the input box allows is exact.
//   trigger — divmod(int(a), int(b)): floor division + modulo, or
//             ZeroDivisionError
//   handle  — float(a) / b inside `except ArithmeticError`: OverflowError
//             when an int does not fit a float, ZeroDivisionError for 0

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise, pyInt } from '../../../py-exceptions.js';

// int(str) as CPython does it: pyInt's parse rules, plus the %.200R
// truncation of the literal in the message and the 4300-digit limit.
function int(s) {
  let v;
  try {
    v = pyInt(s);
  } catch (e) {
    if (e.name !== 'ValueError') throw e;
    const shown = Array.from(pyRepr(String(s))).slice(0, 200).join('');
    return raise('ValueError', `invalid literal for int() with base 10: ${shown}`);
  }
  const digits = (String(s).match(/[0-9]/g) || []).length;
  if (digits > 4300) {
    raise('ValueError', `Exceeds the limit (4300 digits) for integer string conversion: value has ${digits} digits; use sys.set_int_max_str_digits() to increase the limit`);
  }
  return BigInt(v);
}

// Python's divmod for ints: quotient rounds toward minus infinity and the
// remainder takes the sign of the divisor.
function divmod(a, b) {
  if (b === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
  let q = a / b;
  let r = a % b;
  if (r !== 0n && (r < 0n) !== (b < 0n)) {
    q -= 1n;
    r += b;
  }
  return { __pyTuple: [q, r] };
}

// int → float: correctly rounded (Number(BigInt) rounds half-to-even like
// PyLong_AsDouble); too large → OverflowError.
function toFloat(n) {
  const f = Number(n);
  if (!Number.isFinite(f)) raise('OverflowError', 'int too large to convert to float');
  return f;
}

// repr(float): shortest round-trip digits, fixed notation for exponents
// -4..15, otherwise d.ddde±XX.
function floatRepr(x) {
  if (Object.is(x, -0)) return '-0.0';
  if (x === 0) return '0.0';
  const [m, e] = x.toExponential().split('e');
  const exp = parseInt(e, 10);
  const sign = m.startsWith('-') ? '-' : '';
  const digits = m.replace('-', '').replace('.', '');
  if (exp >= -4 && exp <= 15) {
    if (exp >= 0) {
      const intPart = digits.slice(0, exp + 1).padEnd(exp + 1, '0');
      const frac = digits.slice(exp + 1) || '0';
      return `${sign}${intPart}.${frac}`;
    }
    return `${sign}0.${'0'.repeat(-exp - 1)}${digits}`;
  }
  const mant = digits.length > 1 ? `${digits[0]}.${digits.slice(1)}` : digits;
  const es = exp < 0 ? '-' : '+';
  return `${sign}${mant}e${es}${String(Math.abs(exp)).padStart(2, '0')}`;
}

export default {
  trigger: (a, b) => divmod(int(a), int(b)),

  handle: (a, b) => {
    const A = int(a);
    const B = int(b);
    try {
      const fa = toFloat(A);
      const fb = toFloat(B);
      if (fb === 0) raise('ZeroDivisionError', 'float division by zero');
      return { __pyRaw: floatRepr(fa / fb) };
    } catch (e) {
      return `${e.name}: ${e.message}`;
    }
  },
};
