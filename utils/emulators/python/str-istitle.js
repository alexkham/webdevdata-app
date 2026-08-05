// utils/emulators/python/str-istitle.js
//
// Emulator for Python str.istitle().
//
// Rules (matching CPython):
//   - Uppercase character allowed only after a non-cased character or at
//     the start of the string.
//   - Lowercase character allowed only after a cased character.
//   - Requires at least one cased character AND no rule violations.
//   - Empty string returns false.
//
// A "cased character" is one where uppercase !== lowercase (so digits,
// spaces, punctuation, and CJK ideographs are NOT cased).

export default function strIsTitle(string) {
  const s = String(string == null ? '' : string);
  if (s.length === 0) return false;

  let sawCased = false;
  let prevWasCased = false;
  for (const ch of s) {
    const up = ch.toUpperCase();
    const lo = ch.toLowerCase();
    const cased = up !== lo;

    if (cased) {
      const isUpper = ch === up;
      const isLower = ch === lo;
      if (isUpper) {
        if (prevWasCased) return false; // uppercase after cased is a violation
      } else if (isLower) {
        if (!prevWasCased) return false; // lowercase at start-of-word violates
      }
      sawCased = true;
      prevWasCased = true;
    } else {
      prevWasCased = false;
    }
  }
  return sawCased;
}