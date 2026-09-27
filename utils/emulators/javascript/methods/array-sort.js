// Emulator for JavaScript Array.prototype.sort with NO comparator — the
// default, string-based ordering that surprises everyone on numbers.
//
// sort mutates in place and returns the same array. The demo builds a fresh
// array from the input on every call, so mutating it is harmless; the copy
// below just makes that explicit rather than relying on it.
export default function arraySort(items) {
  if (!Array.isArray(items)) throw new TypeError('sort() demo source must be an array');
  return [...items].sort();
}
