// utils/emulators/python/str-rpartition.js
//
// Emulator for Python str.rpartition(sep). Always returns a 3-tuple
// [before, sep, after] (array stands in for tuple). Splits at the LAST
// occurrence of sep. If sep is not found, returns ["", "", original] —
// note the asymmetry with partition, which puts the original in slot 0.
//
// Empty sep raises ValueError, matching CPython.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function strRpartition(string, sep) {
  const s = String(string == null ? '' : string);
  const p = String(sep == null ? '' : sep);
  if (p === '') {
    throw new ValueErrorLike('empty separator');
  }
  const i = s.lastIndexOf(p);
  if (i === -1) return ['', '', s];
  return [s.slice(0, i), p, s.slice(i + p.length)];
}