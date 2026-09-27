// Emulator for Python bytes.center(width, fillbyte).
//
// Uses CPython's exact split for odd padding: the extra byte goes LEFT
// when width is odd and RIGHT when it is even (stringlib's
// `left = pad/2 + (pad & width & 1)`), which is why "ab".center(7) and
// "abc".center(6) lean different ways.

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

export default function bytesCenter(s, width, fill = null) {
  if (typeof s !== 'string' || typeof width !== 'number') {
    throw new TypeError('center() demo arguments are wrong');
  }
  const enc = new TextEncoder();
  const data = [...enc.encode(s)];
  const fillBytes = fill === null || fill === undefined ? [0x20] : [...enc.encode(fill)];
  if (fillBytes.length !== 1) {
    throw new TypeErrorLike('center() argument 2 must be a byte string of length 1, not bytes');
  }
  const pad = width - data.length;
  if (pad <= 0) return { __pyRaw: bytesRepr(data) };

  const left = Math.floor(pad / 2) + (pad & width & 1);
  const right = pad - left;
  const f = fillBytes[0];
  return { __pyRaw: bytesRepr([...Array(left).fill(f), ...data, ...Array(right).fill(f)]) };
}
