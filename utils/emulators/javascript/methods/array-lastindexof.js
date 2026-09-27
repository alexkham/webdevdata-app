// Emulator for JavaScript Array.prototype.lastIndexOf.
// Strict equality scanning from the RIGHT, so like indexOf it can never
// find NaN.
export default function arrayLastIndexOf(items, value) {
  if (!Array.isArray(items)) throw new TypeError('lastIndexOf() demo source must be an array');
  return items.lastIndexOf(value);
}
