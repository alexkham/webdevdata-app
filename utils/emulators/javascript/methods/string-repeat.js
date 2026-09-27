// Emulator for JavaScript String.prototype.repeat.
// A negative count throws RangeError, which the demo shows deliberately.
export default function stringRepeat(s, count) {
  return s.repeat(count);
}
