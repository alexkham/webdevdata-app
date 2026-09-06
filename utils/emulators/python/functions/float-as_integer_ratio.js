// Emulator for Python float.as_integer_ratio() — the EXACT fraction the
// double stores, which is why 0.1 gives a pair of enormous numbers.
//
// A double is significand * 2**exp exactly, so the denominator is always a
// power of two and the fraction reduces by stripping shared factors of 2.
// BigInt keeps the digits exact well past what a JS number could hold.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
class OverflowErrorLike extends Error {
  constructor(message) { super(message); this.name = 'OverflowError'; }
}

const buf = new ArrayBuffer(8);
const f64 = new Float64Array(buf);
const u32 = new Uint32Array(buf);

export default function floatAsIntegerRatio(n) {
  if (typeof n !== 'number') throw new TypeError('as_integer_ratio() demo argument must be float');
  if (Number.isNaN(n)) throw new ValueErrorLike('cannot convert NaN to integer ratio');
  if (!Number.isFinite(n)) throw new OverflowErrorLike('cannot convert Infinity to integer ratio');
  if (n === 0) return { __pyRaw: '(0, 1)' };

  f64[0] = n;
  const hi = u32[1];
  const lo = u32[0];

  const negative = hi >>> 31 === 1;
  const biased = (hi >>> 20) & 0x7ff;
  const mantHi = hi & 0xfffff;
  let significand = (BigInt(mantHi) << 32n) | BigInt(lo >>> 0);
  let exp;

  if (biased === 0) {
    exp = -1074;                       // subnormal: no implicit leading bit
  } else {
    significand |= 1n << 52n;          // restore the implicit leading 1
    exp = biased - 1075;
  }

  // Strip shared factors of two so the fraction is in lowest terms.
  while (exp < 0 && significand % 2n === 0n) {
    significand /= 2n;
    exp += 1;
  }

  let num;
  let den;
  if (exp >= 0) {
    num = significand << BigInt(exp);
    den = 1n;
  } else {
    num = significand;
    den = 1n << BigInt(-exp);
  }

  if (negative) num = -num;
  return { __pyRaw: `(${num}, ${den})` };
}
