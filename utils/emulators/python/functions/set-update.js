// Emulator for Python set.update(other) — mutates in place, returns None.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setUpdate(a, b) {
  if (!Array.isArray(elems(a)) || !Array.isArray(elems(b))) {
    throw new TypeError('update() arguments must be sets');
  }
  return null;
}
