// Emulator for Python str.rpartition(sep) — like partition but the LAST
// occurrence; when absent: ('', '', s).
class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
export default function strRpartition(s, sep) {
  if (typeof s !== 'string' || typeof sep !== 'string') {
    throw new TypeError('rpartition() argument must be str');
  }
  if (sep === '') throw new ValueErrorLike('empty separator');
  const i = s.lastIndexOf(sep);
  if (i === -1) return { __pyTuple: ['', '', s] };
  return { __pyTuple: [s.slice(0, i), sep, s.slice(i + sep.length)] };
}
