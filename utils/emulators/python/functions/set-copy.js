// utils/emulators/python/set-copy.js
//
// Emulator for Python set.copy(). Returns a NEW array with the same
// unique elements as the input, preserving first-seen order for display
// (order is arbitrary from a set&apos;s point of view). Duplicates in the
// demo CSV input collapse first, matching set semantics.

export default function setCopy(set) {
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
  return out;
}