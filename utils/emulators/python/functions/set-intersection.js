// utils/emulators/python/set-intersection.js
//
// Emulator for Python set.intersection(other). Returns an array of unique
// elements standing in for a set — the demo has no real set type. An
// element is kept only if it appears in both a and b. Order shown is
// self&apos;s first-seen order, arbitrary from a set&apos;s point of view but
// stable for display.

function toIterable(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return [...v];
  throw new TypeError("'" + typeof v + "' object is not iterable");
}

export default function setIntersection(a, b) {
  const ai = toIterable(a);
  const bi = toIterable(b);
  const bSet = new Set(bi);
  const seen = new Set();
  const out = [];
  for (const x of ai) {
    if (bSet.has(x) && !seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
}