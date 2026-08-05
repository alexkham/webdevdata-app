// utils/emulators/python/set-pop.js
//
// Emulator for Python set.pop(). Returns the resulting set state so the
// demo has something to display — Python actually returns the removed
// element, and set is mutated. The content file&apos;s demoExplainer says so.
//
// Empty set raises KeyError, matching CPython.
//
// Element choice is documented as "undefined". This emulator pops the
// FIRST-seen (insertion-order) element for stable demo display; users
// should not read anything into which element it happens to be.

class KeyErrorLike extends Error {
  constructor(message) { super(message); this.name = 'KeyError'; }
}

export default function setPop(set) {
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

  if (out.length === 0) {
    throw new KeyErrorLike("'pop from an empty set'");
  }
  // Pop the first element for stable demo display.
  out.shift();
  return out;
}