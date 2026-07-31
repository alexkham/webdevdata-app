// utils/emulators/python/find.js
//
// Emulator for Python str.find(sub, start=0, end=len(s)).
// Returns the lowest index of sub, or -1 when absent — never raises
// (that is str.index's job).

export default function find(s, sub, start = 0, end = null) {
  if (typeof s !== 'string' || typeof sub !== 'string') {
    throw new TypeError('find() argument must be str');
  }
  const lo = start === null ? 0 : Math.max(0, start < 0 ? s.length + start : start);
  const hi = end === null || end === undefined ? s.length : Math.min(s.length, end < 0 ? s.length + end : end);
  if (lo > hi) return -1;
  const idx = s.slice(lo, hi).indexOf(sub);
  return idx === -1 ? -1 : lo + idx;
}
