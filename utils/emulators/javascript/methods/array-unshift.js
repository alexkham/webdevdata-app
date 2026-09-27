// Emulator for JavaScript Array.prototype.unshift.
// Adds to the FRONT and returns the new LENGTH — also O(n), since every
// existing element shifts up one index.
export default function arrayUnshift(items, value) {
  if (!Array.isArray(items)) throw new TypeError('unshift() demo source must be an array');
  return [...items].unshift(value);
}
