// utils/emulators/python/bool.js
//
// Emulator for Python bool(x=False). Applies Python's truthiness rules:
//   - No argument → False
//   - None (null/undefined) → False
//   - Booleans → themselves
//   - Numbers → true iff non-zero and finite
//   - Strings → true iff non-empty
//   - Arrays → true iff non-empty
//   - Objects → true iff has any keys
//
// The demo passes strings through a text input; the string "0" and the
// string "False" are BOTH truthy (non-empty). This is the classic
// pitfall documented in pitfalls.

export default function pyBool(x) {
  if (x === undefined) return false;
  if (x === null) return false;
  if (typeof x === 'boolean') return x;
  if (typeof x === 'number') return x !== 0 && !Number.isNaN(x);
  if (typeof x === 'string') return x.length > 0;
  if (Array.isArray(x)) return x.length > 0;
  if (typeof x === 'object') return Object.keys(x).length > 0;
  return Boolean(x);
}