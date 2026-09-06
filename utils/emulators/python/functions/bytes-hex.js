// Emulator for Python bytes.hex() — two lowercase hex digits per byte,
// no separator and no 0x prefix. The demo uses the no-argument form.
export default function bytesHex(s) {
  if (typeof s !== 'string') throw new TypeError('hex() demo source must be str');
  let out = '';
  for (const b of new TextEncoder().encode(s)) {
    out += b.toString(16).padStart(2, '0');
  }
  return out;
}
