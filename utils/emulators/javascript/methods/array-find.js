// Emulator for JavaScript Array.prototype.find.
// Returns the ELEMENT, or undefined when nothing matches — which is why a
// falsy element is indistinguishable from "not found" without findIndex.
export default function arrayFind(items, threshold) {
  if (!Array.isArray(items)) throw new TypeError('find() demo source must be an array');
  return items.find((x) => x > threshold);
}
