// utils/emulators/python/str-count.js
//
// Emulator for Python str.count(sub, start=0, end=len(s)).
// Non-overlapping occurrences, like CPython: 'aaaa'.count('aa') == 2.
// Empty sub counts gaps: 'abc'.count('') == 4.

export default function strCount(s, sub, start = 0, end = null) {
  if (typeof s !== 'string' || typeof sub !== 'string') {
    throw new TypeError('count() argument must be str');
  }
  const lo = start === null ? 0 : Math.max(0, start < 0 ? s.length + start : start);
  const hi = end === null || end === undefined ? s.length : Math.min(s.length, end < 0 ? s.length + end : end);
  const region = s.slice(lo, hi);

  if (sub === '') return region.length + 1;

  let count = 0;
  let i = 0;
  while (true) {
    const idx = region.indexOf(sub, i);
    if (idx === -1) break;
    count += 1;
    i = idx + sub.length;
  }
  return count;
}
