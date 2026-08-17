// utils/emulators/python/str-swapcase.js
//
// Emulator for Python str.swapcase(). Flips case per character:
//   - Uppercase → lowercase
//   - Lowercase → uppercase
//   - Non-letters → unchanged
//
// Uses Unicode case mappings via toLowerCase/toUpperCase; for the ASCII
// and common accented cases this matches Python exactly.

export default function strSwapCase(string) {
  const s = String(string == null ? '' : string);
  let out = '';
  for (const ch of s) {
    const lo = ch.toLowerCase();
    const up = ch.toUpperCase();
    if (ch === lo && ch !== up) {
      // Was lowercase — output uppercase.
      out += up;
    } else if (ch === up && ch !== lo) {
      // Was uppercase — output lowercase.
      out += lo;
    } else {
      // No case (digit, punctuation, whitespace, symbol) — unchanged.
      out += ch;
    }
  }
  return out;
}