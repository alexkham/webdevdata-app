// utils/emulators/python/stdlib/difflib/diff_bytes.js
//
// Emulator for the difflib.diff_bytes demo tabs, on the CPython port in
// _pydifflib.js. bytes values are PyBytes (one char per byte); str.encode()
// is UTF-8 by default, 'latin-1' raises UnicodeEncodeError like CPython.

import { diff_bytes, unified_diff, context_diff, PyBytes, cps, run } from './_pydifflib.js';
import { PyException } from '../../../../py-exceptions.js';

const B = (s) => new PyBytes(s);
const SEP = B('|');

const escCp = (cp) => (cp <= 0xff ? '\\x' + cp.toString(16).padStart(2, '0')
  : cp <= 0xffff ? '\\u' + cp.toString(16).padStart(4, '0')
    : '\\U' + cp.toString(16).padStart(8, '0'));

// str.encode('latin-1')
function latin1(str) {
  const a = cps(str);
  const i = a.findIndex((c) => c.codePointAt(0) > 0xff);
  if (i !== -1) {
    let j = i;
    while (j < a.length && a[j].codePointAt(0) > 0xff) j += 1;
    const what = j - i === 1
      ? `character '${escCp(a[i].codePointAt(0))}' in position ${i}`
      : `characters in position ${i}-${j - 1}`;
    throw new PyException('UnicodeEncodeError', `'latin-1' codec can't encode ${what}: ordinal not in range(256)`);
  }
  return B(a.join(''));
}

const out = (gen) => [...gen].map((b) => b.toPy());

export default {
  // old = old.encode().split(b'|'); new = ...
  // list(difflib.diff_bytes(difflib.unified_diff, old, new, b'old.txt', b'new.txt', lineterm=b''))
  unified: (oldText, newText) => run(() => {
    const a = PyBytes.utf8(oldText).split(SEP);
    const b = PyBytes.utf8(newText).split(SEP);
    return out(diff_bytes(unified_diff, a, b, B('old.txt'), B('new.txt'), B(''), B(''), 3, B('')));
  }),

  // old = old.encode('latin-1').split(b'|'); new = new.encode('utf-8').split(b'|')
  // list(difflib.diff_bytes(difflib.unified_diff, old, new, lineterm=b''))
  mixed: (oldText, newText) => run(() => {
    const a = latin1(oldText).split(SEP);
    const b = PyBytes.utf8(newText).split(SEP);
    return out(diff_bytes(unified_diff, a, b, B(''), B(''), B(''), B(''), 3, B('')));
  }),

  // list(difflib.diff_bytes(difflib.context_diff, old, new, lineterm=b''))
  context: (oldText, newText) => run(() => {
    const a = PyBytes.utf8(oldText).split(SEP);
    const b = PyBytes.utf8(newText).split(SEP);
    return out(diff_bytes(context_diff, a, b, B(''), B(''), B(''), B(''), 3, B('')));
  }),
};
