// Emulator for JavaScript Array.prototype.indexOf.
// Strict equality (===), so no type coercion and NaN is never found.
export default function arrayIndexOf(items, value) {
  if (!Array.isArray(items)) throw new TypeError('indexOf() demo source must be an array');
  return items.indexOf(value);
}
