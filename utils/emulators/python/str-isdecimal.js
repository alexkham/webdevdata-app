// utils/emulators/python/str-isdecimal.js
//
// Emulator for Python str.isdecimal(). Returns true iff every codepoint
// is in Unicode general category Nd (decimal digit) AND the string is
// non-empty. This is stricter than \p{N} (which includes all number
// categories) — we use the specific Nd class.

const NOT_DECIMAL = /[^\p{Nd}]/u;

export default function strIsDecimal(string) {
  const s = String(string == null ? '' : string);
  if (s.length === 0) return false;
  return !NOT_DECIMAL.test(s);
}