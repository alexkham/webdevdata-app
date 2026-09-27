// Emulator for JavaScript Array.prototype.slice — copies a range out,
// leaving the source untouched. Negative indices count from the end.
export default function arraySlice(items, start, end) {
  if (!Array.isArray(items)) throw new TypeError('slice() demo source must be an array');
  return items.slice(start, end);
}
