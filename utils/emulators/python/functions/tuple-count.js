// Emulator for Python tuple.count(value) — tallies elements equal to
// value, scanning the whole tuple with no early exit.
export default function tupleCount(items, value) {
  if (!Array.isArray(items)) throw new TypeError('count() argument must be tuple');
  let n = 0;
  for (const item of items) {
    if (item === value) n += 1;
  }
  return n;
}
