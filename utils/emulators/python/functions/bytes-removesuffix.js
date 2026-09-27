// Emulator for Python bytes.removesuffix(suffix) — removes an EXACT suffix
// once, or returns the input unchanged. The correct tool for stripping a
// file extension, where rstrip silently mangles.

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

export default function bytesRemovesuffix(s, suffix) {
  if (typeof s !== 'string' || typeof suffix !== 'string') {
    throw new TypeError('removesuffix() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const suf = enc.encode(suffix);
  const off = data.length - suf.length;
  const matches = suf.length > 0 && off >= 0 && suf.every((b, i) => data[off + i] === b);
  return { __pyRaw: bytesRepr(matches ? data.slice(0, off) : data) };
}
