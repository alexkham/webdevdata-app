// utils/emulators/python/set-intersection_update.js
//
// Emulator for Python set.intersection_update(iterable). Real Python
// returns None and mutates the set in place. For the demo, we return
// the RESULTING state so users can see the effect — the demoExplainer
// notes this.
//
// Keeps only elements found in BOTH the set and the iterable.

function toItems(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    return v.split(',').map(s => s.trim()).filter(s => s !== '');
  }
  return [v];
}

export default function setIntersectionUpdate(set, other) {
  const start = toItems(set);
  const keep = new Set(toItems(other));
  return start.filter(x => keep.has(x));
}