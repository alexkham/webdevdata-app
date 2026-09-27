// Emulator for JavaScript Array.prototype.pop.
// Returns the REMOVED element, or undefined on an empty array.
export default function arrayPop(items) {
  if (!Array.isArray(items)) throw new TypeError('pop() demo source must be an array');
  return [...items].pop();
}
