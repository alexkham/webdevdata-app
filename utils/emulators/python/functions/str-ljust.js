// utils/emulators/python/str-ljust.js
//
// Emulator for Python str.ljust(width, fillchar=" ").
//
// Behavior:
//   - width <= len(s) returns s unchanged (no truncation).
//   - fillchar defaults to space; must be exactly one character otherwise
//     — raises TypeError like CPython.
//   - Padding goes on the RIGHT.

export default function strLjust(string, width, fillchar) {
  const s = String(string == null ? '' : string);
  const w = Math.trunc(Number(width));
  let f = fillchar;
  if (f === null || f === undefined || f === '') f = ' ';
  f = String(f);
  if ([...f].length !== 1) {
    throw new TypeError('The fill character must be exactly one character long');
  }
  if (!Number.isFinite(w) || w <= [...s].length) return s;
  return s + f.repeat(w - [...s].length);
}