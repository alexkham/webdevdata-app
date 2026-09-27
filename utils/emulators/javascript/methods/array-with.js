// Emulator for JavaScript Array.prototype.with — a copy with one index
// replaced. Unlike bracket assignment, an out-of-range index throws a
// RangeError instead of silently adding a property.
export default function arrayWith(items, index, value) {
  if (!Array.isArray(items)) throw new TypeError('with() demo source must be an array');
  return items.with(index, value);
}
