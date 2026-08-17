// utils/emulators/python/set-issuperset.js
//
// Emulator for Python set.issuperset(other). Returns true iff every
// element of other appears in self. Empty other returns true for any
// self (vacuously) — including empty vs empty.

function toIterable(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return [...v];
  throw new TypeError("'" + typeof v + "' object is not iterable");
}

export default function setIsSuperset(a, b) {
  const aSet = new Set(toIterable(a));
  const bi = toIterable(b);
  for (const x of bi) {
    if (!aSet.has(x)) return false;
  }
  return true;
}