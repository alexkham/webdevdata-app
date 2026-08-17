// utils/emulators/python/dict-keys.js
//
// Emulator for Python dict.keys(). Returns an array of keys, preserving
// insertion order (matching Python 3.7+ behavior — the demo input arrives
// as an insertion-ordered object).

export default function dictKeys(dict) {
  if (dict === null || dict === undefined) {
    throw new TypeError("'NoneType' object has no attribute 'keys'");
  }
  if (typeof dict !== 'object' || Array.isArray(dict)) {
    throw new TypeError("descriptor 'keys' requires a 'dict' object");
  }
  return Object.keys(dict);
}