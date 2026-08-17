// utils/emulators/python/dict-items.js
//
// Emulator for Python dict.items(). Returns an array of [key, value] pairs,
// preserving insertion order (matching Python 3.7+ behavior — the demo input
// arrives as an insertion-ordered object).

export default function dictItems(dict) {
  if (dict === null || dict === undefined) {
    throw new TypeError("'NoneType' object has no attribute 'items'");
  }
  if (typeof dict !== 'object' || Array.isArray(dict)) {
    throw new TypeError("descriptor 'items' requires a 'dict' object");
  }
  return Object.entries(dict);
}