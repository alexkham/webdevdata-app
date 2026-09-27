// Emulator for JavaScript Array.prototype.flatMap.
//
// Maps then flattens exactly ONE level. Returning an empty array from the
// callback drops the element entirely, which is the filter-and-map trick
// the demo shows.
export default function arrayFlatMap(items, factor) {
  if (!Array.isArray(items)) throw new TypeError('flatMap() demo source must be an array');
  return items.flatMap((x) => [x, x * factor]);
}
