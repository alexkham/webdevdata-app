// Emulator for Python bytes.join(iterable) — the separator is the object
// the method is called ON, which is the part that surprises people.
//
// The demo supplies the parts as comma-separated text, so each part is
// encoded to utf-8 before joining.

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

export default function bytesJoin(sep, parts) {
  if (typeof sep !== 'string') throw new TypeError('join() separator must be str');
  if (!Array.isArray(parts)) throw new TypeError('join() argument must be iterable');

  const enc = new TextEncoder();
  const sepBytes = enc.encode(sep);

  const out = [];
  parts.forEach((p, i) => {
    if (i > 0) out.push(...sepBytes);
    out.push(...enc.encode(p));
  });
  return { __pyRaw: bytesRepr(out) };
}
