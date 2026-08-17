// utils/emulators/python/map.js
//
// Emulator for Python map(func, iterable). The demo cannot accept a
// callable through a text input, so we bake in a fixed example: DOUBLE
// each item. Users can see the pattern and mentally substitute their own
// function.
//
// Real Python map returns a lazy iterator; the demo returns an array
// for display.

export default function pyMap(items) {
  const arr = items === null || items === undefined
    ? []
    : Array.isArray(items)
      ? items
      : typeof items === 'string'
        ? items.split(',').map(s => s.trim()).filter(s => s !== '')
        : [items];

  return arr.map(v => Number(v) * 2);
}