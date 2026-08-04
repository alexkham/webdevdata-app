// utils/emulators/python/frozenset.js
//
// Emulator for Python frozenset(iterable). Deduplicates the input and
// renders the result in Python's frozenset(...) display form:
//   - empty: "frozenset()"
//   - non-empty: "frozenset({a, b, c})"
//
// Preserves first-seen order for display; real Python's set order is
// arbitrary but this is a visualization detail.

function renderElement(v) {
  const s = String(v);
  // Numeric-looking: emit as-is.
  if (/^-?\d+(\.\d+)?$/.test(s)) return s;
  // Otherwise as a Python-style string literal with single quotes.
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

export default function pyFrozenSet(items) {
  const arr = items === null || items === undefined
    ? []
    : Array.isArray(items)
      ? items
      : typeof items === 'string'
        ? items.split(',').map(s => s.trim()).filter(s => s !== '')
        : [items];

  const seen = new Set();
  const uniq = [];
  for (const v of arr) {
    const key = typeof v === 'string' ? v : String(v);
    if (!seen.has(key)) { seen.add(key); uniq.push(v); }
  }

  if (uniq.length === 0) return 'frozenset()';
  return 'frozenset({' + uniq.map(renderElement).join(', ') + '})';
}