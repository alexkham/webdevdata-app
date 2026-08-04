// utils/emulators/python/set-union.js
//
// Emulator for Python set.union(other). Returns an array of unique elements
// standing in for a set — the demo has no real set type. Order shown is
// first-seen order across (a, then b), which is arbitrary from a set&apos;s
// point of view but stable for display purposes.
//
// String &quot;iterables&quot; explode into characters, matching the classic
// Python footgun documented in the pitfalls section.

function toIterable(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return [...v];
  throw new TypeError("'" + typeof v + "' object is not iterable");
}

export default function setUnion(a, b) {
  const ai = toIterable(a);
  const bi = toIterable(b);
  const seen = new Set();
  const out = [];
  for (const x of ai) {
    if (!seen.has(x)) { seen.add(x); out.push(x); }
  }
  for (const x of bi) {
    if (!seen.has(x)) { seen.add(x); out.push(x); }
  }
  return out;
}