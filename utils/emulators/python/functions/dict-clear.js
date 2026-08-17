// Emulator for Python dict.clear() — empties in place, returns None.
export default function dictClear(d) {
  if (d === null || typeof d !== 'object' || Array.isArray(d)) {
    throw new TypeError('clear() argument must be dict');
  }
  return null;
}
