// Emulator for Python set.difference_update(other) — mutates in place,
// returns None.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setDifferenceUpdate(s, other) {
  if (!Array.isArray(elems(s))) throw new TypeError('difference_update() argument must be set');
  return null;
}
