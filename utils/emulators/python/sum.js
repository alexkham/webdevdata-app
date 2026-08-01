// utils/emulators/python/sum.js
//
// Emulator for Python sum(iterable, start=0) over numbers. Python rejects
// strings explicitly (sum(['a']) is a TypeError telling you to use join) —
// mirrored here.

export default function pySum(iterable, start = 0) {
  if (!Array.isArray(iterable)) throw new TypeError('sum() argument must be iterable');
  let total = typeof start === 'number' && Number.isFinite(start) ? start : 0;
  for (const item of iterable) {
    if (typeof item !== 'number' || !Number.isFinite(item)) {
      throw new TypeError("unsupported operand type(s) for +: 'int' and 'str'");
    }
    total += item;
  }
  return total;
}
