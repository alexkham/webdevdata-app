// Emulator for JavaScript Array.prototype.toReversed — reverse, but it
// returns a NEW array and leaves the source alone.
export default function arrayToReversed(items) {
  if (!Array.isArray(items)) throw new TypeError('toReversed() demo source must be an array');
  return items.toReversed();
}
