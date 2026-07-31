// utils/emulators/python/len.js
//
// Emulator for Python len(obj) — works on strings (character count),
// lists, and dicts (key count), like Python's sized built-ins.

export default function pyLen(obj) {
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length;
  if (obj !== null && typeof obj === 'object') return Object.keys(obj).length;
  throw new TypeError(`object of type '${typeof obj}' has no len()`);
}
