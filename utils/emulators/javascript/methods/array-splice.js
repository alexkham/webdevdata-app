// Emulator for JavaScript Array.prototype.splice.
//
// splice returns the REMOVED elements, not the remaining array — which is
// the single most confused thing about it, and what the demo output shows.
// A copy is spliced so the caller's array is not disturbed.
export default function arraySplice(items, start, count) {
  if (!Array.isArray(items)) throw new TypeError('splice() demo source must be an array');
  return [...items].splice(start, count);
}
