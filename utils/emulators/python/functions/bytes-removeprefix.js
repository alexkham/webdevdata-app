// Emulator for Python bytes.removeprefix(prefix) — removes an EXACT prefix
// once, or returns the input unchanged. This is the method people usually
// want when they reach for lstrip.

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

export default function bytesRemoveprefix(s, prefix) {
  if (typeof s !== 'string' || typeof prefix !== 'string') {
    throw new TypeError('removeprefix() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const pre = enc.encode(prefix);
  const matches = pre.length <= data.length && pre.every((b, i) => data[i] === b);
  return { __pyRaw: bytesRepr(matches ? data.slice(pre.length) : data) };
}
