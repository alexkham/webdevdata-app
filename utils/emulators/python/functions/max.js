// utils/emulators/python/max.js
//
// Emulator for Python max(iterable). With the demo's comma-separated
// input every item is a string, so comparison is lexicographic — exactly
// Python comparing a list of strings. Raises on an empty iterable with
// Python's message.

class ValueErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

export default function pyMax(iterable) {
  if (!Array.isArray(iterable)) throw new TypeError('max() argument must be iterable');
  if (iterable.length === 0) throw new ValueErrorLike('max() arg is an empty sequence');
  let best = iterable[0];
  for (const item of iterable) {
    if (item > best) best = item;
  }
  return best;
}
