// Emulator for JavaScript Array.prototype.reverse.
// reverse mutates and returns the SAME array. A copy is reversed here so
// the caller's array is never disturbed by a demo render.
export default function arrayReverse(items) {
  if (!Array.isArray(items)) throw new TypeError('reverse() demo source must be an array');
  return [...items].reverse();
}
