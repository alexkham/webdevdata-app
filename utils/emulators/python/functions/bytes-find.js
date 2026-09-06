// Emulator for Python bytes.find(sub) — BYTE offset of the first match,
// or -1 when absent. Byte-level, so a multi-byte character shifts the
// offsets compared with the equivalent str.find.

function match(hay, needle, at) {
  for (let k = 0; k < needle.length; k += 1) {
    if (hay[at + k] !== needle[k]) return false;
  }
  return true;
}

export default function bytesFind(s, sub) {
  if (typeof s !== 'string' || typeof sub !== 'string') {
    throw new TypeError('find() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const hay = enc.encode(s);
  const needle = enc.encode(sub);

  if (needle.length === 0) return 0;

  for (let i = 0; i + needle.length <= hay.length; i += 1) {
    if (match(hay, needle, i)) return i;
  }
  return -1;
}
