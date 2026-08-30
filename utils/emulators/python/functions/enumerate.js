// Emulator for Python list(enumerate(iterable, start=0)) — (index, item)
// tuples. The demo shows the list() form; bare enumerate() is lazy.
export default function pyEnumerate(items, start = null) {
  if (!Array.isArray(items)) throw new TypeError('enumerate() argument must be iterable');
  const s = start === null || start === undefined ? 0 : Math.trunc(start);
  return items.map((v, i) => ({ __pyTuple: [s + i, v] }));
}
