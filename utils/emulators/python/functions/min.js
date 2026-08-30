// utils/emulators/python/min.js
//
// Emulator for Python min(iterable). Mirror of max — see max.js.
// String items compare lexicographically, like Python.

class ValueErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

export default function pyMin(iterable) {
  if (!Array.isArray(iterable)) throw new TypeError('min() argument must be iterable');
  if (iterable.length === 0) throw new ValueErrorLike('min() iterable argument is empty');
  let best = iterable[0];
  for (const item of iterable) {
    if (item < best) best = item;
  }
  return best;
}
