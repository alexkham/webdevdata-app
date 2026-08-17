// utils/emulators/python/startswith.js
//
// Emulator for Python str.startswith(prefix, start=0, end=len(s)).
// Returns a bool. (Python also accepts a tuple of prefixes; the demo
// covers the single-prefix form.)

export default function startswith(s, prefix, start = 0, end = null) {
  if (typeof s !== 'string' || typeof prefix !== 'string') {
    throw new TypeError('startswith() argument must be str');
  }
  const lo = start === null ? 0 : Math.max(0, start < 0 ? s.length + start : start);
  const hi = end === null || end === undefined ? s.length : Math.min(s.length, end < 0 ? s.length + end : end);
  if (lo > hi) return false;
  return s.slice(lo, hi).startsWith(prefix);
}
