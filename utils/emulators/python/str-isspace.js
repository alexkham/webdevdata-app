// utils/emulators/python/str-isspace.js
//
// Emulator for Python str.isspace(). Returns true iff every codepoint is
// Unicode whitespace AND the string is non-empty. Uses the `\s` character
// class with the Unicode flag, which matches CPython's classification for
// the common cases (ASCII whitespace, non-breaking space, various Unicode
// spaces).

const NOT_SPACE = /[^\s]/u;

export default function strIsSpace(string) {
  const s = String(string == null ? '' : string);
  if (s.length === 0) return false;
  return !NOT_SPACE.test(s);
}