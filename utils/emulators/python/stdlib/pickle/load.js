// utils/emulators/python/stdlib/pickle/load.js
//
// Emulator for the pickle.load demo tabs: io.BytesIO holds the "file", so
// where load() stops reading is visible. On the _pickle.c port in
// _pypickle.js (file-object reads modelled exactly: one read() per opcode
// argument, readline() for text arguments) and _pyliteral.js.

import { literalEval } from './_pyliteral.js';
import { pyRepr, bytesRepr, rawTuple, Unpickler, BytesFile, PyBytes, typeName } from './_pypickle.js';
import { PyException } from '../../../../py-exceptions.js';

// io.BytesIO(initial_bytes): bytes, or None for an empty buffer
function bytesIO(v) {
  if (v === null) return new BytesFile(new Uint8Array(0));
  if (v instanceof PyBytes) return new BytesFile(v.b);
  throw new PyException('TypeError', `a bytes-like object is required, not '${typeName(v)}'`);
}

export default {
  // buf = io.BytesIO(ast.literal_eval(data)); value = pickle.load(buf)
  // (value, buf.tell(), buf.read())
  read: (text) => {
    const f = bytesIO(literalEval(text));
    const value = new Unpickler(f).load();
    const pos = f.pos;
    return rawTuple(pyRepr(value), String(pos), bytesRepr(f.read(Infinity)));
  },

  // load until EOFError: items = []; while True: try: items.append(pickle.load(buf)) except EOFError: break
  all: (text) => {
    const f = bytesIO(literalEval(text));
    const items = [];
    for (;;) {
      try {
        items.push(new Unpickler(f).load());
      } catch (e) {
        if (e.name === 'EOFError') break;
        throw e;
      }
      if (items.length > 1000) throw Object.assign(new Error('the demo stops after 1000 objects'), { name: 'DemoLimit' });
    }
    return { __pyRaw: '[' + items.map(pyRepr).join(', ') + ']' };
  },
};
