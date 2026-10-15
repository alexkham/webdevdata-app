// utils/emulators/python/stdlib/pickle/dump.js
//
// Emulator for the pickle.dump demo tabs: io.BytesIO stands in for the
// file, so what dump() writes is visible. On the _pickle.c port in
// _pypickle.js and the ast.literal_eval port in _pyliteral.js.

import { literalEval } from './_pyliteral.js';
import { dumps, pyRepr, bytesRepr, rawTuple, Unpickler, BytesFile } from './_pypickle.js';

export default {
  // buf = io.BytesIO(); pickle.dump(ast.literal_eval(value), buf, protocol=protocol); buf.getvalue()
  file: (text, protocol) => ({ __pyRaw: bytesRepr(dumps(literalEval(text), protocol)) }),

  // two dump() calls into one file, then two load() calls and the rest
  // buf.seek(0); (pickle.load(buf), pickle.load(buf), buf.read())
  append: (first, second) => {
    const a = dumps(literalEval(first));
    const b = dumps(literalEval(second));
    const all = new Uint8Array(a.length + b.length);
    all.set(a);
    all.set(b, a.length);
    const f = new BytesFile(all);
    const x = new Unpickler(f).load();
    const y = new Unpickler(f).load();
    return rawTuple(pyRepr(x), pyRepr(y), bytesRepr(f.read(Infinity)));
  },
};
