// utils/emulators/python/str-isascii.js
//
// Emulator for Python str.isascii(). Returns true iff every codepoint is
// less than 128 (the ASCII range). The empty string returns TRUE — the
// notable exception to the is* family's usual empty-is-false rule,
// because "every character is ASCII" is vacuously satisfied.

export default function strIsAscii(string) {
  const s = String(string == null ? '' : string);
  for (const ch of s) {
    if (ch.codePointAt(0) >= 128) return false;
  }
  return true;
}