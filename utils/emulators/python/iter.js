// utils/emulators/python/iter.js
//
// Emulator for Python iter(iterable). Returns an array of the items the
// iterator would yield — preserving order AND duplicates (unlike a set).
//
// Real Python returns an iterator object with __next__ semantics; the
// demo shell has no way to display a live iterator, so we materialize
// the items for display. The demoExplainer notes this.

export default function pyIter(items) {
  return items === null || items === undefined
    ? []
    : Array.isArray(items)
      ? items.slice()
      : typeof items === 'string'
        ? items.split(',').map(s => s.trim()).filter(s => s !== '')
        : [items];
}