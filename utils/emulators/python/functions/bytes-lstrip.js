// Emulator for Python bytes.lstrip(chars) — strips a SET of bytes from the
// left end only. The demo always passes an explicit set.

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

export default function bytesLstrip(s, chars) {
  if (typeof s !== 'string' || typeof chars !== 'string') {
    throw new TypeError('lstrip() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const set = new Set(enc.encode(chars));
  let start = 0;
  while (start < data.length && set.has(data[start])) start += 1;
  return { __pyRaw: bytesRepr(data.slice(start)) };
}
