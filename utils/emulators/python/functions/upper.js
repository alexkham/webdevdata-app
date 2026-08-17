// utils/emulators/python/upper.js
//
// Emulator for Python str.upper().

export default function upper(s) {
  if (typeof s !== 'string') throw new TypeError('upper() argument must be str');
  return s.toUpperCase();
}
