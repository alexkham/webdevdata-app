// Emulator for Python set.pop() — removes and returns an ARBITRARY
// element; raises KeyError on an empty set. Deterministic here (first
// element) — the page explains that real Python picks arbitrarily.
class KeyErrorLike extends Error {
  constructor(message) { super(message); this.name = 'KeyError'; }
}
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setPop(s) {
  const items = elems(s);
  if (!Array.isArray(items)) throw new TypeError('pop() argument must be set');
  if (items.length === 0) throw new KeyErrorLike("'pop from an empty set'");
  return items[0];
}
