// Emulator for Python str.rindex(sub[, start]) — LAST occurrence, raising
// ValueError instead of returning -1.
//
// Note: JS lastIndexOf(sub, from) scans backwards FROM an index, while
// Python's start is the LEFT boundary of the searched slice. Slicing first
// and re-adding the offset gives Python's semantics.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function strRindex(s, sub, start = null) {
  if (typeof s !== 'string') throw new TypeError('rindex() argument must be str');
  const from = start === null || start === undefined ? 0 : start;
  const i = s.slice(from).lastIndexOf(sub);
  if (i === -1) throw new ValueErrorLike('substring not found');
  return i + from;
}
