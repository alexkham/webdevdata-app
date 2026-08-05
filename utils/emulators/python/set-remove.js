// utils/emulators/python/set-remove.js
//
// Emulator for Python set.remove(elem). Returns the resulting set state
// so the demo has something to display — Python actually returns None and
// mutates in place (demoExplainer says so).
//
// Missing element raises KeyError, matching CPython — the entire point
// of choosing remove over discard.

class KeyErrorLike extends Error {
  constructor(message) { super(message); this.name = 'KeyError'; }
}

export default function setRemove(set, elem) {
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

  if (elem === null || elem === undefined || elem === '') {
    throw new KeyErrorLike("''");
  }
  const idx = out.indexOf(elem);
  if (idx === -1) {
    throw new KeyErrorLike("'" + elem + "'");
  }
  out.splice(idx, 1);
  return out;
}