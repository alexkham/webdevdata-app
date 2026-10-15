// utils/emulators/python/stdlib/pickle/pickler.js
//
// Emulator for the pickle.Pickler demo tabs: one Pickler, two dump()
// calls — the memo survives between them unless clear_memo() runs. On the
// _pickle.c port in _pypickle.js and _pyliteral.js.

import { literalEval } from './_pyliteral.js';
import { Pickler, bytesRepr, rawTuple } from './_pypickle.js';

// p = pickle.Pickler(buf, protocol=protocol); p.dump(value)
// first = buf.getvalue(); [p.clear_memo()]; p.dump(value)
// (first, buf.getvalue()[len(first):])
function twice(text, protocol, clear) {
  const value = literalEval(text);
  const p = new Pickler(protocol);
  const first = p.dump(value);
  if (clear) p.clearMemo();
  const second = p.dump(value);
  return rawTuple(bytesRepr(first), bytesRepr(second));
}

export default {
  memo: (text, protocol) => twice(text, protocol, false),
  clear: (text, protocol) => twice(text, protocol, true),
};
