// utils/emulators/python/dict-update.js
//
// Emulator for Python dict.update(other). Returns the resulting dict state
// so the demo has something to display — Python actually returns None and
// mutates in place (demoExplainer says so).
//
// Later value wins on key collision. Existing keys keep their position;
// new keys are appended — matching Python 3.7+ insertion-order semantics.

export default function dictUpdate(dict, other) {
  if (dict === null || dict === undefined) dict = {};
  if (other === null || other === undefined) other = {};
  if (typeof dict !== 'object' || Array.isArray(dict)) {
    throw new TypeError("descriptor 'update' requires a 'dict' object");
  }
  if (typeof other !== 'object' || Array.isArray(other)) {
    throw new TypeError("'" + typeof other + "' object is not iterable");
  }
  // Preserve insertion order: keep existing key positions, append new keys.
  const out = {};
  for (const k of Object.keys(dict)) out[k] = k in other ? other[k] : dict[k];
  for (const k of Object.keys(other)) if (!(k in out)) out[k] = other[k];
  return out;
}