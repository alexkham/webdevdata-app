// Emulator for the entries / keys / values iterator trio, dispatched by
// name. Each returns a lazy Array Iterator; the demo spreads it so the
// contents are visible rather than "Object [Array Iterator] {}".
const METHODS = { entries: true, keys: true, values: true };

export default function arrayIterators(items, method) {
  if (!Array.isArray(items)) throw new TypeError('demo source must be an array');
  if (!METHODS[method]) {
    throw new TypeError(`items.${method} is not a function`);
  }
  return [...items[method]()];
}
