// Emulator for Python s.translate(str.maketrans(frm, to)) — the demo
// builds the table inline, so this maps characters directly.
class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
export default function strTranslate(s, frm, to) {
  if (typeof s !== 'string' || typeof frm !== 'string' || typeof to !== 'string') {
    throw new TypeError('translate() demo arguments must be str');
  }
  if (frm.length !== to.length) {
    throw new ValueErrorLike('the first two maketrans arguments must have equal length');
  }
  const map = new Map();
  for (let i = 0; i < frm.length; i += 1) map.set(frm[i], to[i]);
  return Array.from(s).map((ch) => (map.has(ch) ? map.get(ch) : ch)).join('');
}
