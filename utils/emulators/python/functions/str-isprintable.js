// utils/emulators/python/str-isprintable.js
//
// Emulator for Python str.isprintable(). Returns true iff every codepoint
// is NOT a control character (Unicode category Cc). Empty string returns
// TRUE — the same "empty is True" behavior as isascii.
//
// Python also has a small carve-out: space (U+0020) is category Zs but
// is considered printable, which matches Unicode category-based logic
// (only Cc is rejected outright). We reject on \p{C} which covers
// control, format, unassigned, private-use, and surrogate — Python
// actually only rejects Cc but for the common demo cases (tab, newline,
// NUL) the result matches.
//
// For strict Python parity, the rule is: reject only Cc.

export default function strIsPrintable(string) {
  const s = String(string == null ? '' : string);
  if (s.length === 0) return true;

  // \p{Cc} matches ASCII and Latin-1 control characters — the same
  // ones Python's isprintable rejects.
  for (const ch of s) {
    if (/\p{Cc}/u.test(ch)) return false;
  }
  return true;
}