// Emulator for Python float(x) parsing a string: whitespace, sign,
// underscores between digits, inf/nan spellings. Integral results carry
// the .0 float marker, like Python.
class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
export default function pyFloat(x) {
  const original = String(x);
  const t = original.trim();
  const sign = t[0] === '-' ? -1 : 1;
  const st = t.replace(/^[+-]/, '').toLowerCase();
  if (st === 'inf' || st === 'infinity') return sign * Infinity;
  if (st === 'nan') return NaN;
  const bad = () => {
    throw new ValueErrorLike("could not convert string to float: '" + original + "'");
  };
  if (/^_|_$|__/.test(st) || /_(?=[.e])|[.e]_/.test(st)) bad();
  const cleaned = t.replace(/_/g, '');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(cleaned)) bad();
  const v = parseFloat(cleaned);
  if (Number.isInteger(v) && Math.abs(v) < 1e16) return { __pyRaw: v + '.0' };
  return v;
}
