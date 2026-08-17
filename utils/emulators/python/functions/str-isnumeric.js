// utils/emulators/python/str-isnumeric.js
//
// Emulator for Python str.isnumeric(). Returns true iff every codepoint
// is a Unicode numeric character (\p{N}) AND the string is non-empty.
// \p{N} covers digits, letter-numbers (Roman numerals), and other numbers
// (fractions, superscripts) — matching Python's classification for the
// common cases.

const NOT_NUMERIC = /[^\p{N}]/u;

export default function strIsNumeric(string) {
  const s = String(string == null ? '' : string);
  if (s.length === 0) return false;
  return !NOT_NUMERIC.test(s);
}