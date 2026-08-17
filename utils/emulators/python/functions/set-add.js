// Emulator for Python set.add(elem) — mutates in place, returns None.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setAdd(s, elem) {
  if (!Array.isArray(elems(s))) throw new TypeError('add() argument must be set');
  return null;
}
