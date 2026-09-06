// Emulator for Python bytes.endswith(suffix) — byte-level suffix test.
export default function bytesEndswith(s, suffix) {
  if (typeof s !== 'string' || typeof suffix !== 'string') {
    throw new TypeError('endswith() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const suf = enc.encode(suffix);

  if (suf.length > data.length) return false;
  const offset = data.length - suf.length;
  for (let i = 0; i < suf.length; i += 1) {
    if (data[offset + i] !== suf[i]) return false;
  }
  return true;
}
