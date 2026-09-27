// Emulator for Python bytes.rsplit(sep, maxsplit) — splits from the RIGHT.
// With a maxsplit, the un-split remainder stays in the FIRST element.

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

export default function bytesRsplit(s, sep, maxsplit = null) {
  if (typeof s !== 'string' || typeof sep !== 'string') {
    throw new TypeError('rsplit() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const needle = enc.encode(sep);
  const limit = maxsplit === null || maxsplit === undefined || maxsplit < 0 ? Infinity : maxsplit;

  if (needle.length === 0) throw new ValueErrorLike('empty separator');

  const parts = [];
  let end = data.length;
  let i = data.length - needle.length;
  let splits = 0;
  while (i >= 0 && splits < limit) {
    if (match(data, needle, i)) {
      parts.unshift(data.slice(i + needle.length, end));
      end = i;
      i -= needle.length;
      splits += 1;
    } else {
      i -= 1;
    }
  }
  parts.unshift(data.slice(0, end));

  return parts.map((p) => ({ __pyRaw: bytesRepr(p) }));
}
