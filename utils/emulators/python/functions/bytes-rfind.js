// Emulator for Python bytes.rfind(sub) — BYTE offset of the LAST match,
// or -1 when absent. Byte-level, like bytes.find.

function match(hay, needle, at) {
  for (let k = 0; k < needle.length; k += 1) {
    if (hay[at + k] !== needle[k]) return false;
  }
  return true;
}

export default function bytesRfind(s, sub) {
  if (typeof s !== 'string' || typeof sub !== 'string') {
    throw new TypeError('rfind() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const hay = enc.encode(s);
  const needle = enc.encode(sub);

  if (needle.length === 0) return hay.length;

  for (let i = hay.length - needle.length; i >= 0; i -= 1) {
    if (match(hay, needle, i)) return i;
  }
  return -1;
}
