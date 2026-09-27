// Emulator for the static Array.of.
// Array.of(n) always makes a ONE-element array, where Array(n) makes an
// empty array of length n — the inconsistency Array.of exists to fix.
export default function arrayOf(value) {
  if (typeof value !== 'number') throw new TypeError('of() demo argument must be a number');
  return Array.of(value);
}
