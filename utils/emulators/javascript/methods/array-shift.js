// Emulator for JavaScript Array.prototype.shift.
// Removes and returns the FIRST element — O(n), because everything after
// it has to move down one index.
export default function arrayShift(items) {
  if (!Array.isArray(items)) throw new TypeError('shift() demo source must be an array');
  return [...items].shift();
}
