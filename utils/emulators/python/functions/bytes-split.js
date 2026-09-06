// Emulator for Python bytes.split(sep) — byte-level split on an explicit
// separator, returning a list of bytes objects.
//
// An empty separator is a ValueError, unlike str.split which raises the
// same way but with a different message.

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

export default function bytesSplit(s, sep) {
  if (typeof s !== 'string' || typeof sep !== 'string') {
    throw new TypeError('split() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const needle = enc.encode(sep);

  if (needle.length === 0) throw new ValueErrorLike('empty separator');

  const parts = [];
  let start = 0;
  let i = 0;
  while (i + needle.length <= data.length) {
    if (match(data, needle, i)) {
      parts.push(data.slice(start, i));
      i += needle.length;
      start = i;
    } else {
      i += 1;
    }
  }
  parts.push(data.slice(start));

  return parts.map((p) => ({ __pyRaw: bytesRepr(p) }));
}
