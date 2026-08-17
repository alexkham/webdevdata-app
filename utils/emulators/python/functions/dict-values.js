// utils/emulators/python/dict-values.js
//
// Emulator for Python dict.values(). Returns an array of values,
// preserving insertion order (matching Python 3.7+ behavior).

export default function dictValues(dict) {
  if (dict === null || dict === undefined) {
    throw new TypeError("'NoneType' object has no attribute 'values'");
  }
  if (typeof dict !== 'object' || Array.isArray(dict)) {
    throw new TypeError("descriptor 'values' requires a 'dict' object");
  }
  return Object.values(dict);
}