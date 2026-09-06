// Emulator for Python bytearray.append(byte) — grows the buffer in place.
//
// The demo expression uses a walrus so the RESULTING buffer is shown rather
// than the None that append actually returns.

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

export default function bytearrayAppend(s, byte) {
  if (typeof s !== 'string' || typeof byte !== 'number') {
    throw new TypeError('append() demo arguments are wrong');
  }
  if (byte < 0 || byte > 255) {
    throw new ValueErrorLike('byte must be in range(0, 256)');
  }
  const data = [...new TextEncoder().encode(s), byte];
  return { __pyRaw: bytearrayRepr(data) };
}
