// Emulator for JavaScript Array.prototype.every.
// An empty array is always TRUE — vacuous truth, and the reason this method
// surprises people far more often than some does.
export default function arrayEvery(items, threshold) {
  if (!Array.isArray(items)) throw new TypeError('every() demo source must be an array');
  return items.every((x) => x > threshold);
}
