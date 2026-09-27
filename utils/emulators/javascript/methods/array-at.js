// Emulator for JavaScript Array.prototype.at.
// Accepts negative indices, which bracket notation cannot: arr[-1] looks up
// a PROPERTY named "-1" and yields undefined.
export default function arrayAt(items, index) {
  if (!Array.isArray(items)) throw new TypeError('at() demo source must be an array');
  return items.at(index);
}
