// Emulator for Python bytes.capitalize() — first byte upper-cased, every
// other byte lower-cased, ASCII only.

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

export default function bytesCapitalize(s) {
  if (typeof s !== 'string') throw new TypeError('capitalize() demo source must be str');
  const out = [...new TextEncoder().encode(s)].map((b, i) => {
    if (i === 0) return b >= 0x61 && b <= 0x7a ? b - 32 : b;
    return b >= 0x41 && b <= 0x5a ? b + 32 : b;
  });
  return { __pyRaw: bytesRepr(out) };
}
