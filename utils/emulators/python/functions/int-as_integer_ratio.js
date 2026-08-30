// Emulator for Python int.as_integer_ratio() — always (n, 1).
// An integer is already a whole number over one; the sign stays on the
// numerator so the denominator is always positive.
export default function intAsIntegerRatio(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('as_integer_ratio() demo argument must be int');
  }
  return { __pyTuple: [n, 1] };
}
