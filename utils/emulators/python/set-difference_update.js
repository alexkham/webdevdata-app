// utils/emulators/python/set-difference_update.js
//
// Emulator for Python set.difference_update(iterable). Real Python
// returns None and mutates the set in place. For the demo, we return
// the RESULTING state so users can see the effect — the demoExplainer
// notes this.
//
// Removes every element that appears in the iterable, silently ignoring
// elements not in the set.

function toItems(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    return v.split(',').map(s => s.trim()).filter(s => s !== '');
  }
  return [v];
}

export default function setDifferenceUpdate(set, other) {
  const start = toItems(set);
  const remove = new Set(toItems(other));
  return start.filter(x => !remove.has(x));
}