// utils/emulators/python/filter.js
//
// Emulator for Python filter(predicate, iterable). The demo cannot
// accept a callable through a text input, so we bake in a fixed
// example predicate: KEEP POSITIVE items (x > 0). Users can see the
// pattern and mentally substitute their own predicate.
//
// Real Python filter returns a lazy iterator; the demo returns an
// array for display.

export default function pyFilter(items) {
  const arr = items === null || items === undefined
    ? []
    : Array.isArray(items)
      ? items
      : typeof items === 'string'
        ? items.split(',').map(s => s.trim()).filter(s => s !== '')
        : [items];

  return arr.filter(v => Number(v) > 0);
}