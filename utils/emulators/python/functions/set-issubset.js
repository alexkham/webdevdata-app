// utils/emulators/python/set-issubset.js
//
// Emulator for Python set.issubset(other). Returns true iff every element
// of self appears in other. Empty self returns true for any other,
// including empty (vacuously true).

function toIterable(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return [...v];
  throw new TypeError("'" + typeof v + "' object is not iterable");
}

export default function setIsSubset(a, b) {
  const ai = toIterable(a);
  const bSet = new Set(toIterable(b));
  for (const x of ai) {
    if (!bSet.has(x)) return false;
  }
  return true;
}