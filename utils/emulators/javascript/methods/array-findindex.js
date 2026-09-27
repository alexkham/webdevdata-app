// Emulator for JavaScript Array.prototype.findIndex.
// Returns the POSITION, or -1 — which is how you distinguish "found a
// falsy element" from "found nothing", something find() cannot do.
export default function arrayFindIndex(items, threshold) {
  if (!Array.isArray(items)) throw new TypeError('findIndex() demo source must be an array');
  return items.findIndex((x) => x > threshold);
}
