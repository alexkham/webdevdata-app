// Emulator for JavaScript Array.prototype.toSorted with NO comparator.
// Non-mutating, but it inherits sort's default STRING comparison — the
// trap does not go away just because the array is copied.
export default function arrayToSorted(items) {
  if (!Array.isArray(items)) throw new TypeError('toSorted() demo source must be an array');
  return items.toSorted();
}
