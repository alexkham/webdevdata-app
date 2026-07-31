// utils/emulators/python/lower.js
//
// Emulator for Python str.lower().

export default function lower(s) {
  if (typeof s !== 'string') throw new TypeError('lower() argument must be str');
  return s.toLowerCase();
}
