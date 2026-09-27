// Emulator for JavaScript Array.prototype.filter.
// The callback is fixed to match the one shown in the demo expression.
export default function arrayFilter(items, threshold) {
  if (!Array.isArray(items)) throw new TypeError('filter() demo source must be an array');
  return items.filter((x) => x > threshold);
}
