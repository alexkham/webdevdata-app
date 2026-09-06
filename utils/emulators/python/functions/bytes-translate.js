// Emulator for Python bytes.translate(bytes.maketrans(frm, to)).
//
// Byte-for-byte substitution: each byte is looked up in a 256-entry table
// and replaced. Unlike replace, it only ever maps SINGLE bytes, which is
// why it can do many substitutions in one pass.

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

export default function bytesTranslate(s, frm, to) {
  if ([s, frm, to].some((x) => typeof x !== 'string')) {
    throw new TypeError('translate() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const fromBytes = enc.encode(frm);
  const toBytes = enc.encode(to);

  if (fromBytes.length !== toBytes.length) {
    throw new ValueErrorLike('maketrans arguments must have same length');
  }

  const table = new Map();
  for (let i = 0; i < fromBytes.length; i += 1) table.set(fromBytes[i], toBytes[i]);

  const out = [];
  for (const b of data) out.push(table.has(b) ? table.get(b) : b);
  return { __pyRaw: bytesRepr(out) };
}
