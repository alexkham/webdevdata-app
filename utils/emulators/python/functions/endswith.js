// utils/emulators/python/endswith.js
//
// Emulator for Python str.endswith(suffix, start=0, end=len(s)).
// Returns a bool. (Python also accepts a tuple of suffixes; the demo
// covers the single-suffix form.)

export default function endswith(s, suffix, start = 0, end = null) {
  if (typeof s !== 'string' || typeof suffix !== 'string') {
    throw new TypeError('endswith() argument must be str');
  }
  const lo = start === null ? 0 : Math.max(0, start < 0 ? s.length + start : start);
  const hi = end === null || end === undefined ? s.length : Math.min(s.length, end < 0 ? s.length + end : end);
  if (lo > hi) return false;
  return s.slice(lo, hi).endsWith(suffix);
}
