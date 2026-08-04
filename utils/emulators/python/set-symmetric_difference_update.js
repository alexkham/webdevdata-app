// utils/emulators/python/set-symmetric_difference_update.js
//
// Emulator for Python set.symmetric_difference_update(iterable). Real
// Python returns None and mutates the set in place. For the demo, we
// return the RESULTING state so users can see the effect.
//
// Symmetric difference: elements in exactly one of the two collections.

function toItems(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    return v.split(',').map(s => s.trim()).filter(s => s !== '');
  }
  return [v];
}

export default function setSymmetricDifferenceUpdate(set, other) {
  const a = toItems(set);
  const b = toItems(other);
  const aSet = new Set(a);
  const bSet = new Set(b);
  const out = [];
  const seen = new Set();
  for (const x of [...a, ...b]) {
    if (seen.has(x)) continue;
    seen.add(x);
    // Keep if in exactly one of a/b.
    if (aSet.has(x) !== bSet.has(x)) out.push(x);
  }
  return out;
}