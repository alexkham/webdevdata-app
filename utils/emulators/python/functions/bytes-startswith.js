// Emulator for Python bytes.startswith(prefix) — byte-level prefix test.
export default function bytesStartswith(s, prefix) {
  if (typeof s !== 'string' || typeof prefix !== 'string') {
    throw new TypeError('startswith() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const pre = enc.encode(prefix);

  if (pre.length > data.length) return false;
  for (let i = 0; i < pre.length; i += 1) {
    if (data[i] !== pre[i]) return false;
  }
  return true;
}
