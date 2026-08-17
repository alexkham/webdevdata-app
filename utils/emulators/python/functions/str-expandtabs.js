// utils/emulators/python/str-expandtabs.js
//
// Emulator for Python str.expandtabs(tabsize=8). Replaces each tab with
// enough spaces to align the next character at the next multiple of
// tabsize columns.
//
// Rules matching CPython:
//   - Column counter starts at 0.
//   - Tab replaced with (tabsize - column % tabsize) spaces.
//   - Newline (\n) and carriage return (\r) reset column to 0.
//   - tabsize=0: tabs are removed entirely (documented behavior).

export default function strExpandTabs(string, tabsize) {
  const s = String(string == null ? '' : string);
  const t = tabsize === '' || tabsize === null || tabsize === undefined
    ? 8
    : Math.trunc(Number(tabsize));

  if (!Number.isFinite(t) || t < 0) {
    // Negative tabsize is invalid — Python raises ValueError.
    throw new (class extends Error { constructor(m) { super(m); this.name = 'ValueError'; }})('tabsize must be non-negative');
  }

  let out = '';
  let col = 0;
  for (const ch of s) {
    if (ch === '\t') {
      if (t === 0) continue; // remove
      const fill = t - (col % t);
      out += ' '.repeat(fill);
      col += fill;
    } else if (ch === '\n' || ch === '\r') {
      out += ch;
      col = 0;
    } else {
      out += ch;
      col++;
    }
  }
  return out;
}