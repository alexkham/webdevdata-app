// utils/emulators/python/set-discard.js
//
// Emulator for Python set.discard(elem). Returns the resulting set state
// so the demo has something to display — Python actually returns None and
// mutates in place (demoExplainer says so).
//
// Missing element is a silent no-op — that is the whole point of choosing
// discard over remove. Duplicates in the demo CSV input collapse first
// (that is what sets do).

export default function setDiscard(set, elem) {
  const items = set === null || set === undefined
    ? []
    : Array.isArray(set)
      ? set
      : typeof set === 'string'
        ? [...set]
        : [];

  const seen = new Set();
  const out = [];
  for (const x of items) {
    if (!seen.has(x)) { seen.add(x); out.push(x); }
  }
  if (elem === null || elem === undefined || elem === '') return out;
  const idx = out.indexOf(elem);
  if (idx !== -1) out.splice(idx, 1);
  return out;
}