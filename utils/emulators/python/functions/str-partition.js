// Emulator for Python str.partition(sep) — (before, sep, after); when
// sep is absent: (s, '', '').
class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
export default function strPartition(s, sep) {
  if (typeof s !== 'string' || typeof sep !== 'string') {
    throw new TypeError('partition() argument must be str');
  }
  if (sep === '') throw new ValueErrorLike('empty separator');
  const i = s.indexOf(sep);
  if (i === -1) return { __pyTuple: [s, '', ''] };
  return { __pyTuple: [s.slice(0, i), sep, s.slice(i + sep.length)] };
}
