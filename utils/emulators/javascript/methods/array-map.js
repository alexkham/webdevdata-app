// Emulator for JavaScript Array.prototype.map.
//
// Note how little there is here compared with a Python emulator: the demo
// runs in a JS engine already, so the "emulator" IS the real method. There
// is no reimplementation to drift from the spec — only the callback is
// fixed, to match the one shown in the demo expression.
export default function arrayMap(items, factor) {
  if (!Array.isArray(items)) throw new TypeError('map() demo source must be an array');
  return items.map((x) => x * factor);
}
