// utils/emulators/python/next.js
//
// Emulator for Python next(iterator[, default]). The demo takes a
// comma-separated list and returns its first element — the natural
// "first item" behavior. If the list is empty:
//   - if default is provided (non-empty text), return default
//   - otherwise raise StopIteration-like error
//
// Real Python next() advances a stateful cursor; the demo shell has no
// place to hold that state, so we always show the first element. The
// demoExplainer flags this.

class StopIterationLike extends Error {
  constructor(message) { super(message); this.name = 'StopIteration'; }
}

export default function pyNext(items, defaultValue) {
  const arr = items === null || items === undefined
    ? []
    : Array.isArray(items)
      ? items
      : typeof items === 'string'
        ? items.split(',').map(s => s.trim()).filter(s => s !== '')
        : [items];

  if (arr.length > 0) return arr[0];
  if (defaultValue !== null && defaultValue !== undefined && defaultValue !== '') {
    return defaultValue;
  }
  throw new StopIterationLike('StopIteration');
}