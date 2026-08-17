// Emulator for Python set.discard(elem) — removes if present, returns
// None either way (never raises — that is the difference from remove).
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setDiscard(s, elem) {
  if (!Array.isArray(elems(s))) throw new TypeError('discard() argument must be set');
  return null;
}
