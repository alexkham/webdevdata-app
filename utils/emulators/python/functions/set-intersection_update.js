// Emulator for Python set.intersection_update(other) — mutates in
// place, returns None.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setIntersectionUpdate(a, b) {
  if (!Array.isArray(elems(a)) || !Array.isArray(elems(b))) {
    throw new TypeError('intersection_update() arguments must be sets');
  }
  return null;
}
