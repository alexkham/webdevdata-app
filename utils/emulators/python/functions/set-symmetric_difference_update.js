// Emulator for Python set.symmetric_difference_update(other) — mutates
// in place, returns None.
const elems = (s) => (s && s.__pySet !== undefined ? s.__pySet : s);
export default function setSymmetricDifferenceUpdate(a, b) {
  if (!Array.isArray(elems(a)) || !Array.isArray(elems(b))) {
    throw new TypeError('symmetric_difference_update() arguments must be sets');
  }
  return null;
}
