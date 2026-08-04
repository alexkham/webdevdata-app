// utils/emulators/python/set-add.js
//
// Emulator for Python set.add(elem). Returns the resulting set state so
// the demo has something to display — Python actually returns None and
// mutates in place (demoExplainer says so).
//
// Duplicates are silently ignored. Order shown is first-seen order,
// arbitrary from a set's point of view but stable for display.

export default function setAdd(set, elem) {
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
  if (elem !== null && elem !== undefined && elem !== '' && !seen.has(elem)) {
    out.push(elem);
  }
  return out;
}