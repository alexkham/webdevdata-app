// Emulator for Python bytes.rpartition(sep) — splits at the LAST occurrence.
// Always a 3-tuple; when absent, everything lands in the TAIL (the mirror
// of partition, which fills the head).

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
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

function match(hay, needle, at) {
  for (let k = 0; k < needle.length; k += 1) {
    if (hay[at + k] !== needle[k]) return false;
  }
  return true;
}

export default function bytesRpartition(s, sep) {
  if (typeof s !== 'string' || typeof sep !== 'string') {
    throw new TypeError('rpartition() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const needle = enc.encode(sep);

  if (needle.length === 0) throw new ValueErrorLike('empty separator');

  for (let i = data.length - needle.length; i >= 0; i -= 1) {
    if (match(data, needle, i)) {
      return {
        __pyRaw: '(' + [
          bytesRepr(data.slice(0, i)),
          bytesRepr(needle),
          bytesRepr(data.slice(i + needle.length)),
        ].join(', ') + ')',
      };
    }
  }
  return { __pyRaw: '(' + ["b''", "b''", bytesRepr(data)].join(', ') + ')' };
}
