// Emulator for Python bytes.splitlines(keepends).
//
// Unlike str.splitlines, the bytes version breaks ONLY at \n, \r and \r\n
// ("ASCII line boundaries") — the exotic separators such as \x0b, \x1c
// and \x85 that str recognises are plain bytes here. A trailing
// terminator does not produce a final empty item.

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

export default function bytesSplitlines(s, keepends = null) {
  if (typeof s !== 'string') throw new TypeError('splitlines() demo source must be str');
  const keep = !(keepends === null || keepends === undefined || keepends === 0);

  const data = new TextEncoder().encode(s);
  const lines = [];
  let start = 0;
  let i = 0;
  while (i < data.length) {
    const b = data[i];
    if (b === 10 || b === 13) {
      let end = i + 1;
      if (b === 13 && data[i + 1] === 10) end = i + 2; // \r\n is one terminator
      lines.push(data.slice(start, keep ? end : i));
      start = end;
      i = end;
    } else {
      i += 1;
    }
  }
  if (start < data.length) lines.push(data.slice(start));

  return lines.map((l) => ({ __pyRaw: bytesRepr(l) }));
}
