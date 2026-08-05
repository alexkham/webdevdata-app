// utils/emulators/python/str-isupper.js
//
// Emulator for Python str.isupper(). Returns true iff:
//   - the string contains at least one CASED character, AND
//   - every cased character is uppercase.
//
// A "cased character" is one where toUpperCase and toLowerCase differ
// from the character itself in the expected direction — Unicode-aware
// via the JavaScript case-conversion primitives.

export default function strIsUpper(string) {
  const s = String(string == null ? '' : string);
  if (s.length === 0) return false;

  let sawCased = false;
  for (const ch of s) {
    const up = ch.toUpperCase();
    const lo = ch.toLowerCase();
    if (up === lo) continue;      // non-cased character (digit, punct, space, symbol, CJK)
    sawCased = true;
    if (ch !== up) return false;  // a cased character that is not uppercase
  }
  return sawCased;
}