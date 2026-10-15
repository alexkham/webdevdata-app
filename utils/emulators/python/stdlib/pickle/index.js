// utils/emulators/python/stdlib/pickle/index.js
//
// Emulator for the pickle module hub demo (round trip + the bytes), on the
// _pickle.c port in _pypickle.js and the ast.literal_eval port in
// _pyliteral.js.

import { literalEval } from './_pyliteral.js';
import { dumps, loads, pyEquals, pyRepr, bytesRepr, rawTuple, PyBuiltin, typeName } from './_pypickle.js';

export default {
  // value = ast.literal_eval(value); data = pickle.dumps(value)
  // restored = pickle.loads(data); (restored == value, type(restored).__name__, restored)
  roundtrip: (text) => {
    const value = literalEval(text);
    const restored = loads(dumps(value));
    const name = restored instanceof PyBuiltin ? 'type' : typeName(restored);
    return rawTuple(pyEquals(restored, value) ? 'True' : 'False', `'${name}'`, pyRepr(restored));
  },

  // data = pickle.dumps(ast.literal_eval(value), protocol=protocol); (data, len(data))
  bytes: (text, protocol) => {
    const value = literalEval(text);
    const data = dumps(value, protocol);
    return rawTuple(bytesRepr(data), String(data.length));
  },
};
