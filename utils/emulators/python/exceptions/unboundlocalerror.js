// utils/emulators/python/exceptions/unboundlocalerror.js
//
// Emulator for the UnboundLocalError demo modes.
//   trigger — label(n): kind is bound only when n > 0
//   handle  — bump(step) with `global count`: 10 + step
// The number input is shown via repr(): an int literal below 1e21 (exact
// value = the printed digits), a float literal from 1e21 up.

import { raise } from '../../../py-exceptions.js';

const UNBOUND = (name) => `cannot access local variable '${name}' where it is not associated with a value`;

// Python float repr (shortest round-trip digits, exponent outside 1e-4..1e16)
function floatRepr(x) {
  if (Number.isNaN(x)) return 'nan';
  if (!Number.isFinite(x)) return x > 0 ? 'inf' : '-inf';
  if (x === 0) return Object.is(x, -0) ? '-0.0' : '0.0';
  const [mant, e] = x.toExponential().split('e');
  const exp = Number(e);
  if (exp < -4 || exp >= 16) return `${mant}e${exp < 0 ? '-' : '+'}${String(Math.abs(exp)).padStart(2, '0')}`;
  const neg = mant[0] === '-';
  const digits = mant.replace('-', '').replace('.', '');
  let s;
  if (exp < 0) s = '0.' + '0'.repeat(-exp - 1) + digits;
  else if (digits.length > exp + 1) s = digits.slice(0, exp + 1) + '.' + digits.slice(exp + 1);
  else s = digits + '0'.repeat(exp + 1 - digits.length) + '.0';
  return (neg ? '-' : '') + s;
}

function label(n) {
  if (n > 0) return 'positive';
  return raise('UnboundLocalError', UNBOUND('kind'));
}

function bump(step) {
  if (Math.abs(step) >= 1e21) return { __pyRaw: floatRepr(10 + step) };
  return 10n + BigInt(String(step));
}

export default {
  trigger: (n) => label(n),
  handle: (step) => bump(step),
};
