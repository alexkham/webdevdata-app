// utils/emulators/python/set-update.js
//
// Emulator for Python set.update(iterable). Real Python returns None
// and mutates the set in place. For the demo, we return the RESULTING
// state so users can see the effect — the demoExplainer notes this.
//
// Deduplicates the combined input while preserving first-seen order
// for display (set order is arbitrary in Python; this is a demo detail).

function toItems(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    return v.split(',').map(s => s.trim()).filter(s => s !== '');
  }
  return [v];
}

export default function setUpdate(set, other) {
  const combined = [...toItems(set), ...toItems(other)];
  const seen = new Set();
  const out = [];
  for (const x of combined) {
    if (!seen.has(x)) { seen.add(x); out.push(x); }
  }
  return out;
}