// Emulator for Python bytes.rstrip(chars) — strips a SET of bytes from the
// right end only. The demo always passes an explicit set.

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

export default function bytesRstrip(s, chars) {
  if (typeof s !== 'string' || typeof chars !== 'string') {
    throw new TypeError('rstrip() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const set = new Set(enc.encode(chars));
  let end = data.length;
  while (end > 0 && set.has(data[end - 1])) end -= 1;
  return { __pyRaw: bytesRepr(data.slice(0, end)) };
}
