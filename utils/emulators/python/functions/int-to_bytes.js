// Emulator for Python int.to_bytes(length, byteorder) — unsigned only.
// The demo does not expose the keyword-only signed flag, so negatives
// raise exactly as Python does with the default signed=False.

class OverflowErrorLike extends Error {
  constructor(message) { super(message); this.name = 'OverflowError'; }
}
class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

// Same repr rules as the bytes() emulator.
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

export default function intToBytes(n, length, byteorder) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('to_bytes() demo argument must be int');
  }
  if (byteorder !== 'big' && byteorder !== 'little') {
    throw new ValueErrorLike("byteorder must be either 'little' or 'big'");
  }
  if (length < 0) {
    throw new ValueErrorLike('length argument must be non-negative');
  }
  if (n < 0) {
    throw new OverflowErrorLike("can't convert negative int to unsigned");
  }

  // Peel off bytes least-significant first, then orient.
  const out = [];
  let rest = n;
  for (let i = 0; i < length; i += 1) {
    out.push(rest % 256);
    rest = Math.floor(rest / 256);
  }
  if (rest !== 0) {
    throw new OverflowErrorLike('int too big to convert');
  }

  return { __pyRaw: bytesRepr(byteorder === 'big' ? out.reverse() : out) };
}
