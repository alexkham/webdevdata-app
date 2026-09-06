// Emulator for Python bytes.strip(chars) — removes any leading and trailing
// bytes that appear in chars, treated as a SET rather than as a sequence.
//
// The demo always passes an explicit set; Python's no-argument form strips
// ASCII whitespace instead.

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

export default function bytesStrip(s, chars) {
  if (typeof s !== 'string' || typeof chars !== 'string') {
    throw new TypeError('strip() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const set = new Set(enc.encode(chars));

  let start = 0;
  let end = data.length;
  while (start < end && set.has(data[start])) start += 1;
  while (end > start && set.has(data[end - 1])) end -= 1;

  return { __pyRaw: bytesRepr(data.slice(start, end)) };
}
