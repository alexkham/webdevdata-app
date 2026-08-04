// utils/emulators/python/enumerate.js
//
// Emulator for Python enumerate(iterable, start=0). Returns a list of
// [index, item] pairs (arrays stand in for tuples in the demo).
// Strings are iterated char-by-char, matching Python.

export default function pyEnumerate(iterable, start = 0) {
  if (iterable === null || iterable === undefined) {
    throw new TypeError("'NoneType' object is not iterable");
  }
  if (typeof iterable === 'string') iterable = [...iterable];
  if (!Array.isArray(iterable)) {
    throw new TypeError("'" + typeof iterable + "' object is not iterable");
  }
  const s = typeof start === 'number' && Number.isFinite(start) ? Math.trunc(start) : 0;
  return iterable.map((item, i) => [s + i, item]);
}