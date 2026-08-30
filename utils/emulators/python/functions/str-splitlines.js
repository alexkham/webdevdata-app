// Emulator for Python str.splitlines(keepends=False) — splits on the
// full set of line boundaries; the final line needs no terminator.
const BOUNDS = ['\r\n', '\r', '\n', '\v', '\f', '\x1c', '\x1d', '\x1e', '\x85', '\u2028', '\u2029'];
export default function strSplitlines(s, keepends = null) {
  if (typeof s !== 'string') throw new TypeError('splitlines() argument must be str');
  const keep = Boolean(keepends);
  const out = [];
  let line = '';
  let i = 0;
  while (i < s.length) {
    const b = BOUNDS.find((x) => s.startsWith(x, i));
    if (b) {
      out.push(keep ? line + b : line);
      line = '';
      i += b.length;
    } else {
      line += s[i];
      i += 1;
    }
  }
  if (line !== '') out.push(line);
  return out;
}
