// utils/emulators/python/str-islower.js
//
// Emulator for Python str.islower(). Returns true iff:
//   - the string contains at least one CASED character, AND
//   - every cased character is lowercase.
//
// Mirror direction of isupper. Non-cased characters (digits, punctuation,
// whitespace, symbols, CJK) are ignored — only cased characters need to
// be lowercase.

export default function strIsLower(string) {
  const s = String(string == null ? '' : string);
  if (s.length === 0) return false;

  let sawCased = false;
  for (const ch of s) {
    const up = ch.toUpperCase();
    const lo = ch.toLowerCase();
    if (up === lo) continue;      // non-cased character
    sawCased = true;
    if (ch !== lo) return false;  // a cased character that is not lowercase
  }
  return sawCased;
}