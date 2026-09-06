// Emulator for Python memoryview.hex() — two lowercase hex digits per byte,
// with no separator and no 0x prefix.
export default function memoryviewHex(s) {
  if (typeof s !== 'string') throw new TypeError('hex() demo source must be str');
  let out = '';
  for (const b of new TextEncoder().encode(s)) {
    out += b.toString(16).padStart(2, '0');
  }
  return out;
}
