// utils/emulators/python/round.js
//
// Emulator for Python round(number, ndigits=None) with banker's rounding
// (round-half-to-even): round(2.5) == 2, round(3.5) == 4.
//
// Implementation note: naive scaling (number * 10**n, then round) is NOT
// faithful — 2.675 * 100 lands exactly on 267.5 in float arithmetic and
// rounds up, while Python correctly rounds the stored double
// 2.67499999999999982… down to 2.67. So we round on the exact decimal
// expansion from toFixed instead, like Python rounds the true value.

export default function pyRound(number, ndigits = null) {
  if (typeof number !== 'number' || !Number.isFinite(number)) {
    throw new TypeError('round() argument must be a real number');
  }
  const intMode = ndigits === null || ndigits === undefined;
  let n = intMode ? 0 : Math.trunc(Number(ndigits));
  if (!Number.isFinite(n)) n = 0;

  // Very large magnitudes: digits below any reasonable ndigits are zero.
  if (Math.abs(number) >= 1e15) return number;

  const neg = number < 0;
  const s = Math.abs(number).toFixed(30); // exact-enough decimal expansion
  const [ipRaw, fp] = s.split('.');

  // Work on the digit string; `cut` = how many digits we keep.
  let ip = ipRaw;
  let cut = ip.length + n;
  if (cut <= 0) {
    ip = '0'.repeat(1 - cut) + ip; // pad so at least one digit is kept
    cut = 1;
  }
  const digits = (ip + fp).split('');

  const kept = digits.slice(0, cut);
  const rest = digits.slice(cut);

  // Decide the direction: below half, above half, or exact tie.
  let roundUp = false;
  const first = rest.length > 0 ? Number(rest[0]) : 0;
  if (first > 5) roundUp = true;
  else if (first === 5) {
    const remainderNonzero = rest.slice(1).some((d) => d !== '0');
    if (remainderNonzero) roundUp = true;
    else roundUp = Number(kept[kept.length - 1]) % 2 === 1; // tie → to even
  }

  let keptInt = parseInt(kept.join(''), 10) + (roundUp ? 1 : 0);
  let result = n >= 0 ? keptInt / Math.pow(10, n) : keptInt * Math.pow(10, -n);
  if (neg) result = -result;
  return result;
}
