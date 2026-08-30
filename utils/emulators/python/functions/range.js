// Emulator for Python list(range(start, stop, step)). The demo shows the
// list() form; bare range() is lazy.
class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
export default function pyRange(start, stop, step) {
  const s = Math.trunc(Number(start));
  const e = Math.trunc(Number(stop));
  const st = Math.trunc(Number(step));
  if (st === 0) throw new ValueErrorLike('range() arg 3 must not be zero');
  const out = [];
  if (st > 0) for (let i = s; i < e && out.length < 10000; i += st) out.push(i);
  else for (let i = s; i > e && out.length < 10000; i += st) out.push(i);
  return out;
}
