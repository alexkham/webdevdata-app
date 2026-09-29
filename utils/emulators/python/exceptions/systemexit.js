// utils/emulators/python/exceptions/systemexit.js
//
// Emulator for the SystemExit demo modes.
//   trigger — sys.exit(code) caught: e.code is the argument unchanged
//   raise   — SystemExit(*args): code is None / args[0] / the args tuple
//   handle  — finally runs before the handler sees e.code
//
// The `auto` input puts pyRepr(value) into the snippet, so the Python
// value is whatever that literal means: digits → int, a '.' or exponent →
// float, and 'inf' (from overflowing input like 1e400) → NameError.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

// repr(float): shortest round-trip digits, fixed notation for decimal
// exponents -4..15, otherwise d.ddde±XX.
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

// The Python value of the snippet literal for an `auto` argument, as a
// pyRepr-able value. Evaluating the literal can itself raise NameError.
function pyValue(v) {
  if (typeof v !== 'number') return v;
  const lit = pyRepr(v);
  if (lit === 'inf' || lit === '-inf') raise('NameError', "name 'inf' is not defined");
  if (/[.e]/.test(lit)) return { __pyRaw: floatRepr(v) };
  return { __pyRaw: lit };
}

export default {
  trigger: (code) => pyValue(code),

  raise: (args) => {
    let code;
    if (args.length === 0) code = null;
    else if (args.length === 1) code = args[0];
    else code = { __pyTuple: args };
    return { __pyTuple: [code, { __pyTuple: args }] };
  },

  handle: (code) => {
    const log = [];
    let value;
    try {
      value = pyValue(code);
    } finally {
      log.push('finally ran');
    }
    log.push(`exit code ${pyRepr(value)}`);
    return log;
  },
};
