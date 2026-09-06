// Emulator for Python bytes.index(sub) — like find, but raises instead of
// returning -1. Note the message differs from str.index: bytes says
// "subsection not found" where str says "substring not found".

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

function match(hay, needle, at) {
  for (let k = 0; k < needle.length; k += 1) {
    if (hay[at + k] !== needle[k]) return false;
  }
  return true;
}

export default function bytesIndex(s, sub) {
  if (typeof s !== 'string' || typeof sub !== 'string') {
    throw new TypeError('index() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const hay = enc.encode(s);
  const needle = enc.encode(sub);

  if (needle.length === 0) return 0;

  for (let i = 0; i + needle.length <= hay.length; i += 1) {
    if (match(hay, needle, i)) return i;
  }
  throw new ValueErrorLike('subsection not found');
}
