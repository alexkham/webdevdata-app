// utils/emulators/python/rstrip.js
//
// Emulator for Python str.rstrip(chars=None) — strip from the right end
// only. chars is a character set, like strip.

export default function rstrip(s, chars = null) {
  if (typeof s !== 'string') throw new TypeError('rstrip() argument must be str');

  if (chars === null || chars === undefined) {
    return s.replace(/\s+$/, '');
  }
  if (typeof chars !== 'string') throw new TypeError('rstrip arg must be None or str');

  const set = new Set(chars);
  let end = s.length;
  while (end > 0 && set.has(s[end - 1])) end -= 1;
  return s.slice(0, end);
}
