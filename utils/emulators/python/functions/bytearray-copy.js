// Emulator for Python bytearray.copy() — a new, independent bytearray with
// the same contents. Returns the copy, so the demo shows it directly.

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

export default function bytearrayCopy(s) {
  if (typeof s !== 'string') throw new TypeError('copy() demo source must be str');
  return { __pyRaw: bytearrayRepr(new TextEncoder().encode(s)) };
}
