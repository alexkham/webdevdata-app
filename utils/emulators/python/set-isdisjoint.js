// utils/emulators/python/set-isdisjoint.js
//
// Emulator for Python set.isdisjoint(other). Returns true iff self and
// other share no elements. Iterates the smaller side against a Set built
// from the larger, and short-circuits on the first shared element —
// matching CPython's optimization.

function toIterable(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return [...v];
  throw new TypeError("'" + typeof v + "' object is not iterable");
}

export default function setIsDisjoint(a, b) {
  const ai = toIterable(a);
  const bi = toIterable(b);
  // Iterate the shorter side.
  const [shorter, longer] = ai.length <= bi.length ? [ai, bi] : [bi, ai];
  const seen = new Set(longer);
  for (const x of shorter) {
    if (seen.has(x)) return false;
  }
  return true;
}