// Emulator for JavaScript Array.prototype.some.
// An empty array is always false: there is no element that satisfies it.
export default function arraySome(items, threshold) {
  if (!Array.isArray(items)) throw new TypeError('some() demo source must be an array');
  return items.some((x) => x > threshold);
}
