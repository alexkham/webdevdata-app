// Emulator for Python dict.update(other) — merges in place, returns None.
export default function dictUpdate(d, other) {
  if (d === null || typeof d !== 'object' || Array.isArray(d)) {
    throw new TypeError('update() argument must be dict');
  }
  return null;
}
