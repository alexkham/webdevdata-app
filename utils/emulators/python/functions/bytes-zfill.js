// Emulator for Python bytes.zfill(width) — left-pads with ASCII zeros to
// the given width. A leading + or - stays in front of the zeros. Never
// truncates, and pads any content, not just digits.

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

export default function bytesZfill(s, width) {
  if (typeof s !== 'string' || typeof width !== 'number') {
    throw new TypeError('zfill() demo arguments are wrong');
  }
  const data = [...new TextEncoder().encode(s)];
  const pad = width - data.length;
  if (pad <= 0) return { __pyRaw: bytesRepr(data) };

  const zeros = Array(pad).fill(0x30);
  const signed = data.length > 0 && (data[0] === 0x2b || data[0] === 0x2d);
  const out = signed ? [data[0], ...zeros, ...data.slice(1)] : [...zeros, ...data];
  return { __pyRaw: bytesRepr(out) };
}
