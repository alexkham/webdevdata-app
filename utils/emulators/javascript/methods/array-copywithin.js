// Emulator for JavaScript Array.prototype.copyWithin.
//
// Copies a run of elements to another position inside the SAME array. The
// length never changes — elements are overwritten, not inserted. A copy is
// used so a demo render never disturbs the caller's array.
export default function arrayCopyWithin(items, target, start) {
  if (!Array.isArray(items)) throw new TypeError('copyWithin() demo source must be an array');
  return [...items].copyWithin(target, start);
}
