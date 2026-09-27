// Emulator for Python bytes.ljust(width, fillbyte) — pads on the RIGHT so
// the content sits at the left. Never truncates.

class TypeErrorLike extends Error {
  constructor(message) { super(message); this.name = 'TypeError'; }
}

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

export default function bytesLjust(s, width, fill = null) {
  if (typeof s !== 'string' || typeof width !== 'number') {
    throw new TypeError('ljust() demo arguments are wrong');
  }
  const enc = new TextEncoder();
  const data = [...enc.encode(s)];
  const fillBytes = fill === null || fill === undefined ? [0x20] : [...enc.encode(fill)];
  if (fillBytes.length !== 1) {
    throw new TypeErrorLike('ljust() argument 2 must be a byte string of length 1, not bytes');
  }
  const pad = Math.max(0, width - data.length);
  return { __pyRaw: bytesRepr([...data, ...Array(pad).fill(fillBytes[0])]) };
}
