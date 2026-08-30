// Emulator for Python int.bit_count() — popcount of the MAGNITUDE.
// Python ints have no fixed width, so negatives count abs(n), not
// a two-complement form.
export default function intBitCount(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('bit_count() demo argument must be int');
  }
  let ones = 0;
  for (const ch of Math.abs(n).toString(2)) {
    if (ch === '1') ones += 1;
  }
  return ones;
}
