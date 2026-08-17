// Emulator for Python set.clear() — empties in place, returns None.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setClear(s) {
  if (!Array.isArray(elems(s))) throw new TypeError('clear() argument must be set');
  return null;
}
