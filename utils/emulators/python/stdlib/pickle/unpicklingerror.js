// utils/emulators/python/stdlib/pickle/unpicklingerror.js
//
// Emulator for the pickle.UnpicklingError demo tabs: corrupt or truncated
// data through pickle.loads, caught the way real code catches it. On the
// _pickle.c port in _pypickle.js and _pyliteral.js.

import { literalEval } from './_pyliteral.js';
import { loads, bytesArg, isPyException } from './_pypickle.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

export default {
  // try: pickle.loads(data)
  // except pickle.UnpicklingError as e: result = f'UnpicklingError: {e}'
  // except EOFError as e: result = f'EOFError: {e}'
  // else: result = 'loaded fine'
  catch: (text) => {
    const data = literalEval(text);
    try {
      loads(bytesArg(data));
    } catch (e) {
      if (!isPyException(e)) throw e;
      if (e.name === '_pickle.UnpicklingError') return pyStrRepr(`UnpicklingError: ${e.message}`);
      if (e.name === 'EOFError') return pyStrRepr(`EOFError: ${e.message}`);
      throw e;
    }
    return 'loaded fine';
  },

  // try: pickle.loads(ast.literal_eval(data))
  // except Exception as e: result = (type(e).__name__, isinstance(e, pickle.PickleError))
  // else: result = 'loaded fine'
  family: (text) => {
    try {
      loads(bytesArg(literalEval(text)));
    } catch (e) {
      if (!isPyException(e)) throw e;
      const pickleError = e.name === '_pickle.UnpicklingError';
      return { __pyRaw: `(${pyStrRepr(e.name.split('.').pop())}, ${pickleError ? 'True' : 'False'})` };
    }
    return 'loaded fine';
  },
};
