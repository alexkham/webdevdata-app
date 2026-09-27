// Emulator for Python bytes.lower() — ASCII-only case mapping. Only the
// bytes A-Z change; everything else passes through untouched.

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

export default function bytesLower(s) {
  if (typeof s !== 'string') throw new TypeError('lower() demo source must be str');
  const out = [...new TextEncoder().encode(s)].map((b) => (b >= 0x41 && b <= 0x5a ? b + 32 : b));
  return { __pyRaw: bytesRepr(out) };
}
