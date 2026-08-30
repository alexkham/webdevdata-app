// Emulator for Python str.maketrans(x, y) — the two-string form: a dict
// mapping each character's code point in x to the code point in y.
class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
export default function strMaketrans(frm, to) {
  if (typeof frm !== 'string' || typeof to !== 'string') {
    throw new TypeError('maketrans() arguments must be str');
  }
  if (frm.length !== to.length) {
    throw new ValueErrorLike('the first two maketrans arguments must have equal length');
  }
  const pairs = [];
  const seen = new Set();
  for (let i = 0; i < frm.length; i += 1) {
    const k = frm.codePointAt(i);
    if (seen.has(k)) continue; // later duplicates win in Python; keep last
    pairs.push([k, to.codePointAt(i)]);
  }
  // Python keeps the LAST mapping for duplicate keys
  const map = new Map();
  for (let i = 0; i < frm.length; i += 1) map.set(frm.codePointAt(i), to.codePointAt(i));
  const body = [...map.entries()].map(([k, v]) => k + ': ' + v).join(', ');
  return { __pyRaw: '{' + body + '}' };
}
