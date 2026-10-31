// utils/emulators/python/stdlib/difflib/sequencematcher.js
//
// Emulator for the difflib.SequenceMatcher class page demo tabs, on the
// CPython port in _pydifflib.js. Numbers are the Python values of the
// literals the code shows.

import { SequenceMatcher, opcodeToPy, literal, demoLimit, run } from './_pydifflib.js';
import { PyException } from '../../../../py-exceptions.js';
import { pyFloatRepr } from '../../../../demo-coerce.js';

const flt = (x) => ({ __pyRaw: pyFloatRepr(x) });

// text * times (str repetition), with the browser's size limit
function repeat(text, times) {
  const v = literal(times);
  if (v.int === undefined) throw new PyException('TypeError', "can't multiply sequence by non-int of type 'float'");
  if (v.int > 9223372036854775807n || v.int < -9223372036854775808n) demoLimit('a repeat count outside the 64-bit range is not reproduced in the browser');
  if (v.int <= 0n || text === '') return '';
  if (BigInt(Array.from(text).length) * v.int > 20000n) demoLimit('the browser demo builds strings of up to 20,000 characters');
  return text.repeat(Number(v.int));
}

// s.replace(old, new, 1)
function replaceOnce(s, oldS, newS) {
  const i = s.indexOf(oldS);
  return i === -1 ? s : s.slice(0, i) + newS + s.slice(i + oldS.length);
}

export default {
  // s = difflib.SequenceMatcher(lambda x: x in junk, a, b)
  // (s.find_longest_match(), s.get_opcodes())
  isjunk: (a, b, junk) => run(() => {
    const s = new SequenceMatcher((x) => junk.includes(x), a, b);
    return { __pyTuple: [s.find_longest_match().toPy(), s.get_opcodes().map(opcodeToPy)] };
  }),

  // a = text * times; b = a.replace(old, new, 1)
  // (len(b), SequenceMatcher(None, a, b).ratio(), SequenceMatcher(None, a, b, autojunk=False).ratio())
  autojunk: (text, times, oldS, newS) => run(() => {
    const a = repeat(text, times);
    const b = replaceOnce(a, oldS, newS);
    const r1 = new SequenceMatcher(null, a, b).ratio();
    const r2 = new SequenceMatcher(null, a, b, false).ratio();
    return { __pyTuple: [Array.from(b).length, flt(r1), flt(r2)] };
  }),

  // s = SequenceMatcher(); s.set_seq2(target); for w in words: s.set_seq1(w); scores.append((w, s.ratio()))
  reuse: (target, words) => run(() => {
    const s = new SequenceMatcher();
    s.set_seq2(target);
    return words.map((w) => {
      s.set_seq1(w);
      return { __pyTuple: [w, flt(s.ratio())] };
    });
  }),
};
