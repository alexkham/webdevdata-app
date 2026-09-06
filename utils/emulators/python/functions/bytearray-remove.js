// Emulator for Python bytearray.remove(byte) — deletes the FIRST occurrence
// of a byte VALUE, not a position. Absence raises ValueError.

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

export default function bytearrayRemove(s, byte) {
  if (typeof s !== 'string' || typeof byte !== 'number') {
    throw new TypeError('remove() demo arguments are wrong');
  }
  const data = [...new TextEncoder().encode(s)];
  const i = data.indexOf(byte);
  if (i === -1) throw new ValueErrorLike('value not found in bytearray');
  data.splice(i, 1);
  return { __pyRaw: bytearrayRepr(data) };
}
