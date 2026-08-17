// utils/emulators/python/isdigit.js
//
// Emulator for Python str.isdigit() for the common ASCII cases: True when
// the string is non-empty and every character is a digit 0-9. (Python also
// accepts some Unicode digit characters like superscripts.)

export default function isdigit(s) {
  if (typeof s !== 'string') throw new TypeError('isdigit() argument must be str');
  return /^[0-9]+$/.test(s);
}
