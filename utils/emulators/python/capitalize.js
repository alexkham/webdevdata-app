// utils/emulators/python/capitalize.js
//
// Emulator for Python str.capitalize(): first character titlecased,
// EVERYTHING else lowercased — including letters mid-string.

export default function capitalize(s) {
  if (typeof s !== 'string') throw new TypeError('capitalize() argument must be str');
  if (s === '') return '';
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}
