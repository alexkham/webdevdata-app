// Emulator for Python bytes.expandtabs(tabsize) — replaces each tab with
// enough spaces to reach the next column that is a multiple of tabsize.
// The column counter resets on \n and \r, exactly as CPython does.

function bytesRepr(bytes) {
  let out = '';
  for (const b of bytes) {
    if (b === 9) out += '\\t';
    else if (b === 10) out += '\\n';
    else if (b === 13) out += '\\r';
    else if (b === 39) out += "\\'";
    else if (b === 92) out += '\\\\';
    else if (b >= 32 && b <= 126) out += String.fromCharCode(b);
    else out += '\\x' + b.toString(16).padStart(2, '0');
  }
  return "b'" + out + "'";
}

export default function bytesExpandtabs(s, tabsize = null) {
  if (typeof s !== 'string') throw new TypeError('expandtabs() demo source must be str');
  const size = tabsize === null || tabsize === undefined ? 8 : tabsize;

  const out = [];
  let col = 0;
  for (const b of new TextEncoder().encode(s)) {
    if (b === 9) {
      if (size > 0) {
        const n = size - (col % size);
        for (let k = 0; k < n; k += 1) out.push(0x20);
        col += n;
      }
    } else {
      out.push(b);
      col = b === 10 || b === 13 ? 0 : col + 1;
    }
  }
  return { __pyRaw: bytesRepr(out) };
}
