// utils/emulators/python/str-rjust.js
//
// Emulator for Python str.rjust(width, fillchar=" ").
//
// Behavior:
//   - width <= len(s) returns s unchanged (no truncation).
//   - fillchar defaults to space; must be exactly one character otherwise
//     — raises TypeError like CPython.
//   - Padding goes on the LEFT (right-alignment).

export default function strRjust(string, width, fillchar) {
  const s = String(string == null ? '' : string);
  const w = Math.trunc(Number(width));
  let f = fillchar;
  if (f === null || f === undefined || f === '') f = ' ';
  f = String(f);
  if ([...f].length !== 1) {
    throw new TypeError('The fill character must be exactly one character long');
  }
  if (!Number.isFinite(w) || w <= [...s].length) return s;
  return f.repeat(w - [...s].length) + s;
}