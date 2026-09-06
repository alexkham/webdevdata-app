// Emulator for Python float.hex() — exact hexadecimal form of a double.
//
// Format: [-]0x1.<13 hex digits>p<+|-><exponent>, where the exponent is a
// power of TWO. Zero is the special case 0x0.0p+0, and subnormals use a
// leading 0x0. with an exponent of -1022.

const buf = new ArrayBuffer(8);
const f64 = new Float64Array(buf);
const u32 = new Uint32Array(buf);

export default function floatHex(n) {
  if (typeof n !== 'number') throw new TypeError('hex() demo argument must be float');

  if (Number.isNaN(n)) return 'nan';
  if (n === Infinity) return 'inf';
  if (n === -Infinity) return '-inf';

  // Python prints a signed zero as 0x0.0p+0 / -0x0.0p+0.
  if (n === 0) return Object.is(n, -0) ? '-0x0.0p+0' : '0x0.0p+0';

  f64[0] = n;
  const hi = u32[1];
  const lo = u32[0];

  const sign = hi >>> 31 ? '-' : '';
  const biased = (hi >>> 20) & 0x7ff;
  // 52 mantissa bits: 20 from the high word, all 32 from the low word.
  const mantHi = hi & 0xfffff;
  const mantissa = (BigInt(mantHi) << 32n) | BigInt(lo >>> 0);
  const digits = mantissa.toString(16).padStart(13, '0');

  if (biased === 0) {
    // Subnormal — no implicit leading 1, exponent pinned at -1022.
    return `${sign}0x0.${digits}p-1022`;
  }

  const exp = biased - 1023;
  const expSign = exp < 0 ? '-' : '+';
  return `${sign}0x1.${digits}p${expSign}${Math.abs(exp)}`;
}
