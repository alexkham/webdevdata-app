// Emulator for Python bytearray.insert(index, byte) — inserts BEFORE index.
// Out-of-range indexes clamp to the ends rather than raising, exactly like
// list.insert.

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

export default function bytearrayInsert(s, index, byte) {
  if (typeof s !== 'string' || typeof index !== 'number' || typeof byte !== 'number') {
    throw new TypeError('insert() demo arguments are wrong');
  }
  if (byte < 0 || byte > 255) {
    throw new ValueErrorLike('byte must be in range(0, 256)');
  }
  const data = [...new TextEncoder().encode(s)];

  // Clamp exactly as CPython does: negatives count from the end, then both
  // ends are pinned to the valid range.
  let at = index < 0 ? index + data.length : index;
  if (at < 0) at = 0;
  if (at > data.length) at = data.length;

  data.splice(at, 0, byte);
  return { __pyRaw: bytearrayRepr(data) };
}
