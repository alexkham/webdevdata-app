// Emulator for Python memoryview.tobytes() — copies the view out as bytes.
// Same bytesRepr formatting as the bytes() emulator; duplicated rather than
// shared, matching the existing convention in this directory.

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

export default function memoryviewTobytes(s) {
  if (typeof s !== 'string') throw new TypeError('tobytes() demo source must be str');
  return { __pyRaw: bytesRepr(new TextEncoder().encode(s)) };
}
