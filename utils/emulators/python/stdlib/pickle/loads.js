// utils/emulators/python/stdlib/pickle/loads.js
//
// Emulator for the pickle.loads demo tabs, on the _pickle.c port in
// _pypickle.js and the ast.literal_eval port in _pyliteral.js.

import { literalEval } from './_pyliteral.js';
import { dumps, loads, pyRepr, rawTuple, pyEquals, pyIsSeparate, bytesArg, isPyException, excName } from './_pypickle.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

export default {
  // data = ast.literal_eval(data); pickle.loads(data)
  parse: (text) => ({ __pyRaw: pyRepr(loads(bytesArg(literalEval(text)))) }),

  // value = ast.literal_eval(value); restored = pickle.loads(pickle.dumps(value))
  // (restored == value, restored is value)
  copy: (text) => {
    const value = literalEval(text);
    const restored = loads(dumps(value));
    return rawTuple(pyEquals(restored, value) ? 'True' : 'False', pyIsSeparate(restored, value) ? 'True' : 'False');
  },

  // try: pickle.loads(ast.literal_eval(data)) except Exception as e: (type(e).__name__, str(e))
  errors: (text) => {
    const data = literalEval(text);
    let result;
    try {
      result = loads(bytesArg(data));
    } catch (e) {
      if (!isPyException(e)) throw e;
      return rawTuple(pyStrRepr(excName(e)), pyStrRepr(e.message));
    }
    return rawTuple("'loaded'", pyRepr(result));
  },
};
