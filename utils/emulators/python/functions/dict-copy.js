// utils/emulators/python/dict-copy.js
//
// Emulator for Python dict.copy(). Returns a NEW object with the same
// key/value pairs. Insertion order preserved. For the demo the values
// are strings and numbers, so the shallow-copy trap does not manifest
// visibly — but the returned object is a distinct reference from the
// input, exactly matching Python's semantics.

export default function dictCopy(dict) {
  if (dict === null || dict === undefined) {
    throw new TypeError("'NoneType' object has no attribute 'copy'");
  }
  if (typeof dict !== 'object' || Array.isArray(dict)) {
    throw new TypeError("descriptor 'copy' requires a 'dict' object");
  }
  return { ...dict };
}