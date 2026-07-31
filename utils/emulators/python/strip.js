// utils/emulators/python/strip.js
//
// Emulator for Python str.strip(chars=None).
// chars=None (null) → strip whitespace; otherwise strip any of the given
// characters (a set, not a substring) from both ends.

export default function strip(s, chars = null) {
  if (typeof s !== 'string') throw new TypeError('strip() argument must be str');

  if (chars === null || chars === undefined) {
    return s.trim();
  }
  if (typeof chars !== 'string') throw new TypeError('strip arg must be None or str');

  const set = new Set(chars);
  let start = 0;
  let end = s.length;
  while (start < end && set.has(s[start])) start += 1;
  while (end > start && set.has(s[end - 1])) end -= 1;
  return s.slice(start, end);
}
