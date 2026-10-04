// utils/emulators/python/stdlib/os/fspath.js
//
// Emulator for the os.fspath / fsencode / fsdecode demo. The file system
// encoding is UTF-8 (Windows always; Linux and macOS in practice).
// Lone surrogates — which a text field rarely produces — follow the
// POSIX 'surrogateescape' handler: U+DC80..U+DCFF become the raw byte,
// any other surrogate raises UnicodeEncodeError.

import { PyException } from '../../../../py-exceptions.js';
import { splitroot } from '../os-path/_posixpath.js';

const tuple = (...items) => ({ __pyTuple: items });

// Python bytes repr
export function bytesRepr(bytes) {
  const hasSingle = bytes.includes(0x27);
  const hasDouble = bytes.includes(0x22);
  const q = hasSingle && !hasDouble ? '"' : "'";
  let out = '';
  for (const b of bytes) {
    if (b === 0x5c) out += '\\\\';
    else if (b === q.charCodeAt(0)) out += '\\' + q;
    else if (b === 0x09) out += '\\t';
    else if (b === 0x0a) out += '\\n';
    else if (b === 0x0d) out += '\\r';
    else if (b < 0x20 || b >= 0x7f) out += '\\x' + b.toString(16).padStart(2, '0');
    else out += String.fromCharCode(b);
  }
  return `b${q}${out}${q}`;
}

function fsencode(s) {
  const out = [];
  let pos = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp >= 0xd800 && cp <= 0xdfff) {
      if (cp >= 0xdc80 && cp <= 0xdcff) out.push(cp - 0xdc00);
      else throw new PyException('UnicodeEncodeError', `'utf-8' codec can't encode character '${'\\'}u${cp.toString(16)}' in position ${pos}: surrogates not allowed`);
    } else {
      out.push(...new TextEncoder().encode(ch));
    }
    pos += 1;
  }
  return out;
}

// surrogateescape decoding of bytes produced by fsencode
function fsdecode(bytes) {
  let s = '';
  let i = 0;
  while (i < bytes.length) {
    const b = bytes[i];
    const len = b < 0x80 ? 1 : b >= 0xf0 && b <= 0xf4 ? 4 : b >= 0xe0 ? 3 : b >= 0xc2 && b < 0xe0 ? 2 : 0;
    if (len > 0 && i + len <= bytes.length) {
      try {
        s += new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }) /* Python's utf-8 keeps U+FEFF; TextDecoder strips it unless ignoreBOM */.decode(Uint8Array.from(bytes.slice(i, i + len)));
        i += len;
        continue;
      } catch (e) {
        // fall through: escape this byte
      }
    }
    if (b < 0x80) s += String.fromCharCode(b);
    else s += String.fromCharCode(0xdc00 + b);
    i += 1;
  }
  return s;
}

// str(PurePosixPath(p)): root kept ('/' or exactly '//'), '' and '.'
// components dropped, '.' for an empty result
function purePosixStr(p) {
  const [, root, rest] = splitroot(p);
  const parts = rest.split('/').filter((x) => x && x !== '.');
  return root + parts.join('/') || '.';
}

export default {
  encode: (name) => {
    const raw = fsencode(name);
    return tuple({ __pyRaw: bytesRepr(raw) }, fsdecode(raw));
  },

  fspath: (p) => tuple(p, purePosixStr(p)),
};
