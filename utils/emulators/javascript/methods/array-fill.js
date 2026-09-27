// Emulator for JavaScript Array.prototype.fill.
// Fills a copy so the caller's array is untouched by a demo render; the
// real method mutates in place.
export default function arrayFill(items, value) {
  if (!Array.isArray(items)) throw new TypeError('fill() demo source must be an array');
  return [...items].fill(value);
}
