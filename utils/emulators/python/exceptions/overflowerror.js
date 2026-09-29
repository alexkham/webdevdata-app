// utils/emulators/python/exceptions/overflowerror.js
//
// Emulator for the OverflowError demo modes.
//   trigger — math.pow(2, n): converts to float; an infinite result from
//             finite inputs raises OverflowError('math range error'),
//             underflow quietly returns 0.0. Powers of two are exact in
//             both C pow() and JS Math.pow, so results match bit for bit.
//   raise   — to_int32(n): explicit range check.
// The number input is shown via repr(): an int literal below 1e21 (exact
// value = the printed digits), a float literal from 1e21 up.

import { raise } from '../../../py-exceptions.js';

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

const isFloatLiteral = (n) => Math.abs(n) >= 1e21;

function mathPow2(n) {
  // int → float conversion of the exponent is exact enough: any |n| > 2**53
  // over- or underflows regardless of rounding
  const e = isFloatLiteral(n) ? n : Number(BigInt(String(n)));
  const r = Math.pow(2, e);
  if (!Number.isFinite(r)) raise('OverflowError', 'math range error');
  return { __pyRaw: floatRepr(r) };
}

const INT32_MIN = -(2n ** 31n);
const INT32_END = 2n ** 31n;

function toInt32(n) {
  if (isFloatLiteral(n)) raise('OverflowError', `${String(n)} does not fit in int32`);
  const v = BigInt(String(n));
  if (!(INT32_MIN <= v && v < INT32_END)) raise('OverflowError', `${v} does not fit in int32`);
  return v;
}

export default {
  trigger: (n) => mathPow2(n),
  raise: (n) => toInt32(n),
};
