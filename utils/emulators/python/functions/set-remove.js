// Emulator for Python set.remove(elem) — removes in place, returns None;
// raises KeyError when the element is absent.
class KeyErrorLike extends Error {
  constructor(message) { super(message); this.name = 'KeyError'; }
}
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setRemove(s, elem) {
  const items = elems(s);
  if (!Array.isArray(items)) throw new TypeError('remove() argument must be set');
  if (!items.includes(elem)) throw new KeyErrorLike("'" + elem + "'");
  return null;
}
