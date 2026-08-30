// Emulator for Python str.expandtabs(tabsize=8) — column-aware tab
// expansion; newlines reset the column; tabsize 0 removes tabs.
export default function strExpandtabs(s, tabsize = null) {
  if (typeof s !== 'string') throw new TypeError('expandtabs() argument must be str');
  const n = tabsize === null || tabsize === undefined ? 8 : Math.trunc(tabsize);
  let out = '';
  let col = 0;
  for (const ch of s) {
    if (ch === '\t') {
      if (n > 0) {
        const spaces = n - (col % n);
        out += ' '.repeat(spaces);
        col += spaces;
      }
    } else if (ch === '\n' || ch === '\r') {
      out += ch;
      col = 0;
    } else {
      out += ch;
      col += 1;
    }
  }
  return out;
}
