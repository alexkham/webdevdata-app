// Emulator for JavaScript String.prototype.matchAll.
//
// matchAll returns an ITERATOR, so the demo spreads it and takes each whole
// match — exactly what the displayed expression does.
export default function stringMatchAll(s) {
  return [...s.matchAll(/\d+/g)].map((m) => m[0]);
}
