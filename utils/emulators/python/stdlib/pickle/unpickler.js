// utils/emulators/python/stdlib/pickle/unpickler.js
//
// Emulator for the pickle.Unpickler demo tabs: a stream written by ONE
// Pickler (two dump() calls of the same object) read back by ONE Unpickler
// (the memo carries over) or by two pickle.load() calls (fresh memo each
// time). On the _pickle.c port in _pypickle.js and _pyliteral.js.

import { literalEval } from './_pyliteral.js';
import { Pickler, Unpickler, BytesFile, pyRepr, rawTuple, pyIsSeparate } from './_pypickle.js';

function stream(text) {
  const value = literalEval(text);
  const p = new Pickler();
  const a = p.dump(value);
  const b = p.dump(value);
  const all = new Uint8Array(a.length + b.length);
  all.set(a);
  all.set(b, a.length);
  return new BytesFile(all);
}
// the second load either fetched the first object from the memo, or
// unpickled the value again (ints are never memoized)
const isSame = (a, b) => (typeof a === 'bigint' ? pyIsSeparate(a, b) : a === b);

export default {
  // u = pickle.Unpickler(buf); a = u.load(); b = u.load(); (a, b, a is b)
  shared: (text) => {
    const u = new Unpickler(stream(text));
    const a = u.load();
    const b = u.load();
    return rawTuple(pyRepr(a), pyRepr(b), isSame(a, b) ? 'True' : 'False');
  },

  // a = pickle.load(buf); b = pickle.load(buf); (a, b, a is b)
  fresh: (text) => {
    const f = stream(text);
    const a = new Unpickler(f).load();
    const b = new Unpickler(f).load();
    return rawTuple(pyRepr(a), pyRepr(b), isSame(a, b) ? 'True' : 'False');
  },
};
