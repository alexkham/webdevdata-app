// Emulator for Python bytes.title() — the first letter of every run of
// ASCII letters is upper-cased and the rest lower-cased. Any non-letter
// byte ends a word, which is why apostrophes produce "It'S".

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

const isUpper = (b) => b >= 0x41 && b <= 0x5a;
const isLower = (b) => b >= 0x61 && b <= 0x7a;

export default function bytesTitle(s) {
  if (typeof s !== 'string') throw new TypeError('title() demo source must be str');
  const out = [];
  let prevIsLetter = false;
  for (const b of new TextEncoder().encode(s)) {
    const letter = isUpper(b) || isLower(b);
    if (letter) {
      if (!prevIsLetter) out.push(isLower(b) ? b - 32 : b); // word start → upper
      else out.push(isUpper(b) ? b + 32 : b);               // inside word → lower
    } else {
      out.push(b);
    }
    prevIsLetter = letter;
  }
  return { __pyRaw: bytesRepr(out) };
}
