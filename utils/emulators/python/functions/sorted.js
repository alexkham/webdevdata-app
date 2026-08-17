// utils/emulators/python/sorted.js
//
// Emulator for Python sorted(iterable, reverse=False). Returns a NEW list;
// the input is untouched — exactly Python's contract. With the demo's
// comma-separated input all items are strings, so lexicographic order
// matches Python sorting a list of strings ('10' < '2').

export default function pySorted(iterable, reverse = false) {
  if (!Array.isArray(iterable)) throw new TypeError('sorted() argument must be iterable');
  const out = [...iterable].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  if (reverse) out.reverse();
  return out;
}
