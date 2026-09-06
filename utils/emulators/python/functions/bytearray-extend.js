// Emulator for Python bytearray.extend(iterable) — appends every byte from
// an iterable of ints. The demo supplies them as comma-separated numbers.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

function bytearrayRepr(bytes) {
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
  return "bytearray(b'" + out + "')";
}

export default function bytearrayExtend(s, more) {
  if (typeof s !== 'string' || !Array.isArray(more)) {
    throw new TypeError('extend() demo arguments are wrong');
  }
  for (const b of more) {
    if (b < 0 || b > 255) throw new ValueErrorLike('byte must be in range(0, 256)');
  }
  const data = [...new TextEncoder().encode(s), ...more];
  return { __pyRaw: bytearrayRepr(data) };
}
