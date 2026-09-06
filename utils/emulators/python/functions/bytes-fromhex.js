// Emulator for Python bytes.fromhex(s) — parses pairs of hex digits,
// skipping ASCII spaces between them.
//
// The error positions are exact and worth reading closely: an invalid
// character reports its own index, while running out of input mid-pair
// reports the index where the missing digit would have been.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

const isHex = (c) => /[0-9a-fA-F]/.test(c);
const bad = (i) => new ValueErrorLike(
  `non-hexadecimal number found in fromhex() arg at position ${i}`
);

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

export default function bytesFromhex(s) {
  if (typeof s !== 'string') throw new TypeError('fromhex() argument must be str');

  const out = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === ' ') { i += 1; continue; }
    if (!isHex(s[i])) throw bad(i);
    if (i + 1 >= s.length || !isHex(s[i + 1])) throw bad(i + 1);
    out.push(parseInt(s.slice(i, i + 2), 16));
    i += 2;
  }
  return { __pyRaw: bytesRepr(out) };
}
