// utils/emulators/python/set-difference.js
//
// Emulator for Python set.difference(other). Returns an array of unique
// elements standing in for a set — the demo has no real set type. An
// element is kept only if it appears in self but NOT in other. Order
// shown is self's first-seen order, arbitrary from a set&apos;s point of
// view but stable for display.

function toIterable(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return [...v];
  throw new TypeError("'" + typeof v + "' object is not iterable");
}

export default function setDifference(a, b) {
  const ai = toIterable(a);
  const bi = toIterable(b);
  const bSet = new Set(bi);
  const seen = new Set();
  const out = [];
  for (const x of ai) {
    if (!bSet.has(x) && !seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
}