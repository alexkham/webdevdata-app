// Emulator for Python bytes.rindex(sub) — like rfind, but raises
// ValueError("subsection not found") instead of returning -1.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

function match(hay, needle, at) {
  for (let k = 0; k < needle.length; k += 1) {
    if (hay[at + k] !== needle[k]) return false;
  }
  return true;
}

export default function bytesRindex(s, sub) {
  if (typeof s !== 'string' || typeof sub !== 'string') {
    throw new TypeError('rindex() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const hay = enc.encode(s);
  const needle = enc.encode(sub);

  if (needle.length === 0) return hay.length;

  for (let i = hay.length - needle.length; i >= 0; i -= 1) {
    if (match(hay, needle, i)) return i;
  }
  throw new ValueErrorLike('subsection not found');
}
