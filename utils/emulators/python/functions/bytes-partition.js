// Emulator for Python bytes.partition(sep) — always returns a 3-tuple, so
// unpacking never fails. When the separator is absent the head holds
// everything and the other two are empty.

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

export default function bytesPartition(s, sep) {
  if (typeof s !== 'string' || typeof sep !== 'string') {
    throw new TypeError('partition() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const needle = enc.encode(sep);

  if (needle.length === 0) throw new ValueErrorLike('empty separator');

  for (let i = 0; i + needle.length <= data.length; i += 1) {
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
  // Not found: everything lands in the head.
  return { __pyRaw: '(' + [bytesRepr(data), "b''", "b''"].join(', ') + ')' };
}
