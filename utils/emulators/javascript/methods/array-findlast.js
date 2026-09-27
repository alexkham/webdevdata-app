// Emulator for the findLast / findLastIndex pair, dispatched by name so a
// single demo can exercise both. They differ only in what they return:
// the element, or its position.
const METHODS = { findLast: true, findLastIndex: true };

export default function arrayFindLast(items, threshold, method) {
  if (!Array.isArray(items)) throw new TypeError('demo source must be an array');
  if (!METHODS[method]) {
    const e = new TypeError(`items.${method} is not a function`);
    throw e;
  }
  return items[method]((x) => x < threshold);
}
