// Emulator for JavaScript String.prototype.at.
//
// Returns undefined for an out-of-range index, which is the whole contrast
// with charAt (empty string) — so the demo must not coerce it away.
export default function stringAt(s, index) {
  return s.at(index);
}
