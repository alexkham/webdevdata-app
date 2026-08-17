// utils/emulators/python/str-partition.js
//
// Emulator for Python str.partition(sep). Always returns a 3-tuple
// [before, sep, after] (array stands in for tuple). If sep is not found,
// returns [original, "", ""]. Empty sep raises ValueError, matching CPython.

class ValueErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

export default function strPartition(string, sep) {
  const s = String(string == null ? '' : string);
  const p = String(sep == null ? '' : sep);
  if (p === '') {
    throw new ValueErrorLike('empty separator');
  }
  const i = s.indexOf(p);
  if (i === -1) return [s, '', ''];
  return [s.slice(0, i), p, s.slice(i + p.length)];
}