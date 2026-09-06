// Emulator for Python bytearray.reverse() — reverses the BYTES in place.
// On UTF-8 encoded text that destroys multi-byte characters, which is the
// point the page makes.

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

export default function bytearrayReverse(s) {
  if (typeof s !== 'string') throw new TypeError('reverse() demo source must be str');
  const data = [...new TextEncoder().encode(s)].reverse();
  return { __pyRaw: bytearrayRepr(data) };
}
