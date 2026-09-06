// Emulator for Python bytes.count(sub) — non-overlapping occurrences.
//
// Works at the BYTE level, not the character level: a non-ASCII character
// occupies several UTF-8 bytes, so counting characters would give a
// different (wrong) answer.

function match(hay, needle, at) {
  for (let k = 0; k < needle.length; k += 1) {
    if (hay[at + k] !== needle[k]) return false;
  }
  return true;
}

export default function bytesCount(s, sub) {
  if (typeof s !== 'string' || typeof sub !== 'string') {
    throw new TypeError('count() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const hay = enc.encode(s);
  const needle = enc.encode(sub);

  // Python counts the empty sub at every gap, including both ends.
  if (needle.length === 0) return hay.length + 1;

  let count = 0;
  let i = 0;
  while (i + needle.length <= hay.length) {
    if (match(hay, needle, i)) { count += 1; i += needle.length; }
    else i += 1;
  }
  return count;
}
