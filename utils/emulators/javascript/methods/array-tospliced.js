// Emulator for JavaScript Array.prototype.toSpliced.
//
// The critical difference from splice: this returns the RESULTING array,
// not the removed elements. Same arguments, opposite return value.
export default function arrayToSpliced(items, start, count) {
  if (!Array.isArray(items)) throw new TypeError('toSpliced() demo source must be an array');
  return items.toSpliced(start, count);
}
