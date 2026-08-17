// utils/emulators/python/str-center.js
//
// Emulator for Python str.center(width, fillchar=" ").
//
// Behavior:
//   - width <= len(s) returns s unchanged (no truncation).
//   - fillchar defaults to space; must be exactly one character otherwise
//     — raises TypeError like CPython.
//   - Odd padding: floor left, ceil right — extra character goes RIGHT.

export default function strCenter(string, width, fillchar) {
  const s = String(string == null ? '' : string);
  const w = Math.trunc(Number(width));
  let f = fillchar;
  if (f === null || f === undefined || f === '') f = ' ';
  f = String(f);
  if ([...f].length !== 1) {
    throw new TypeError('The fill character must be exactly one character long');
  }
  if (!Number.isFinite(w) || w <= [...s].length) return s;
  const total = w - [...s].length;
  const right = Math.floor(total / 2);
  const left = total - right;
  return f.repeat(left) + s + f.repeat(right);
}