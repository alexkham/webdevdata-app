// utils/emulators/python/stdlib/json/jsondecodeerror.js
//
// Emulator for the json.JSONDecodeError demo tabs. Parsing runs on the
// CPython port in _pyjson.js; the 'build' tab re-implements
// JSONDecodeError.__init__ (Lib/json/decoder.py):
//   lineno = doc.count('\n', 0, pos) + 1
//   colno  = pos - doc.rfind('\n', 0, pos)
// with Python's slice-index rules for pos (negative counts from the end,
// out-of-range is clamped) — so odd positions give CPython's odd numbers.

import { loads, asPy, JSONDecodeError } from './_pyjson.js';
import { fromLiteral } from '../../../../py-num.js';
import { PyException } from '../../../../py-exceptions.js';

export default {
  // json.loads(text), uncaught
  trigger: (text) => asPy(loads(text)),

  // (e.msg, e.lineno, e.colno, e.doc[e.pos:e.pos + 8])
  attributes: (text) => {
    try {
      loads(text);
    } catch (e) {
      if (!(e instanceof JSONDecodeError)) throw e;
      return { __pyTuple: [e.msg, BigInt(e.lineno), BigInt(e.colno), e.doc.slice(e.pos, e.pos + 8).join('')] };
    }
    return 'no error';
  },

  // except ValueError as e: (type(e).__name__, isinstance(e, json.JSONDecodeError))
  catch: (text) => {
    try {
      loads(text);
    } catch (e) {
      if (e instanceof JSONDecodeError) return { __pyTuple: ['JSONDecodeError', true] };
      if (e.name === 'ValueError') return { __pyTuple: ['ValueError', false] };
      throw e;
    }
    return 'parsed fine';
  },

  // doc = line1 + '\n' + line2
  // e = json.JSONDecodeError('Bad value', doc, pos); (e.lineno, e.colno, str(e))
  build: (line1, line2, pos) => {
    const doc = [...`${line1}\n${line2}`];
    const p = fromLiteral(pos);
    if (p.float !== undefined) {
      throw new PyException('TypeError', 'slice indices must be integers or None or have an __index__ method');
    }
    const n = BigInt(doc.length);
    let end = p.int < 0n ? p.int + n : p.int;
    if (end < 0n) end = 0n;
    if (end > n) end = n;
    let count = 0n;
    let last = -1n;
    for (let i = 0; i < Number(end); i++) {
      if (doc[i] === '\n') { count += 1n; last = BigInt(i); }
    }
    const lineno = count + 1n;
    const colno = p.int - last;
    return { __pyTuple: [lineno, colno, `Bad value: line ${lineno} column ${colno} (char ${p.int})`] };
  },
};
