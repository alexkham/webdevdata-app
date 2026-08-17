// utils/emulators/python/set-symmetric_difference.js
//
// Emulator for Python set.symmetric_difference(other). Returns an array
// of unique elements standing in for a set — the demo has no real set
// type. An element is kept only if it appears in exactly ONE of a or b.
// Order shown is a-first-seen then b-first-seen; arbitrary from a set's
// point of view but stable for display.

function toIterable(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return [...v];
  throw new TypeError("'" + typeof v + "' object is not iterable");
}

export default function setSymmetricDifference(a, b) {
  const ai = toIterable(a);
  const bi = toIterable(b);
  const aSet = new Set(ai);
  const bSet = new Set(bi);
  const seen = new Set();
  const out = [];
  for (const x of ai) {
    if (!bSet.has(x) && !seen.has(x)) { seen.add(x); out.push(x); }
  }
  for (const x of bi) {
    if (!aSet.has(x) && !seen.has(x)) { seen.add(x); out.push(x); }
  }
  return out;
}