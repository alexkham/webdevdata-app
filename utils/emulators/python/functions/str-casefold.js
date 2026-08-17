// utils/emulators/python/str-casefold.js
//
// Emulator for Python str.casefold(). JavaScript has no built-in casefold,
// so we start from toLowerCase (which handles the common Unicode cases)
// and then apply the Unicode CaseFolding table's most common special
// cases explicitly:
//
//   - German sharp s: ß → "ss"
//   - Greek final sigma is normalized as part of toLowerCase in modern
//     runtimes, so we do not special-case it here.
//   - A handful of other exotic characters (Cherokee, some ligatures) are
//     not handled — they are extremely rare and would need the full CF
//     table.
//
// For the covered demo cases the output matches CPython.

export default function strCasefold(string) {
  if (string == null) return '';
  let s = String(string);
  // Apply the ß → ss expansion explicitly (case matters — uppercase ẞ
  // exists too as of Unicode 5.1, but is rare).
  s = s.replace(/ß/g, 'ss').replace(/ẞ/g, 'ss');
  // Fall back to locale-neutral lowercase for the rest.
  return s.toLowerCase();
}