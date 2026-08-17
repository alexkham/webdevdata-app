// utils/emulators/python/str-isalpha.js
//
// Emulator for Python str.isalpha(). Returns true iff every codepoint is
// a Unicode letter AND the string is non-empty. Uses the Unicode property
// `\p{L}` via a regex to match Python's classification.

const NOT_ALPHA = /[^\p{L}]/u;

export default function strIsAlpha(string) {
  const s = String(string == null ? '' : string);
  if (s.length === 0) return false;
  return !NOT_ALPHA.test(s);
}