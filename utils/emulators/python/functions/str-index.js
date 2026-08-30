// Emulator for Python str.index(sub[, start]) — like find, but raises
// ValueError instead of returning -1. The returned index is absolute,
// not relative to start.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function strIndex(s, sub, start = null) {
  if (typeof s !== 'string') throw new TypeError('index() argument must be str');
  const from = start === null || start === undefined ? 0 : start;
  const i = s.indexOf(sub, from);
  if (i === -1) throw new ValueErrorLike('substring not found');
  return i;
}
