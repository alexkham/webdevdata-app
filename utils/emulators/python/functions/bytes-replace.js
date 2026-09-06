// Emulator for Python bytes.replace(old, new) — byte-level substitution,
// returning a new bytes object. Replaces every occurrence.

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

export default function bytesReplace(s, oldSub, newSub) {
  if ([s, oldSub, newSub].some((x) => typeof x !== 'string')) {
    throw new TypeError('replace() demo arguments must be str');
  }
  const enc = new TextEncoder();
  const hay = enc.encode(s);
  const from = enc.encode(oldSub);
  const to = enc.encode(newSub);

  const out = [];

  // Python inserts the replacement at every gap when old is empty.
  if (from.length === 0) {
    out.push(...to);
    for (const b of hay) { out.push(b); out.push(...to); }
    return { __pyRaw: bytesRepr(out) };
  }

  let i = 0;
  while (i < hay.length) {
    if (i + from.length <= hay.length && match(hay, from, i)) {
      out.push(...to);
      i += from.length;
    } else {
      out.push(hay[i]);
      i += 1;
    }
  }
  return { __pyRaw: bytesRepr(out) };
}
