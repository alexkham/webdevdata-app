// utils/emulators/python/stdlib/pickle/find_class.js
//
// Emulator for the Unpickler.find_class demo tabs: an allow-list
// Unpickler (find_class sees the RAW module/name from the pickle — for
// protocols 0-2 that is the Python 2 name '__builtin__') and the list of
// GLOBAL opcodes a pickle contains. On the _pickle.c port in _pypickle.js
// and _pyliteral.js.

import { literalEval } from './_pyliteral.js';
import { dumps, Unpickler, BytesFile, genops, pyRepr, unpicklingError } from './_pypickle.js';

const ALLOWED = new Set(['builtins set', 'builtins frozenset']);

export default {
  // class SafeUnpickler(pickle.Unpickler):
  //     def find_class(self, module, name):
  //         if (module, name) in ALLOWED: return super().find_class(module, name)
  //         raise pickle.UnpicklingError(f'{module}.{name} is not allowed')
  // data = pickle.dumps(ast.literal_eval(value), protocol=protocol)
  // SafeUnpickler(io.BytesIO(data)).load()
  safe: (text, protocol) => {
    const data = dumps(literalEval(text), protocol);
    const u = new Unpickler(new BytesFile(data), {
      findClass: (module, name, base) => {
        if (ALLOWED.has(`${module} ${name}`)) return base(module, name);
        throw unpicklingError(`${module}.${name} is not allowed`);
      },
    });
    return { __pyRaw: pyRepr(u.load()) };
  },

  // [arg for op, arg, pos in pickletools.genops(data) if op.name == 'GLOBAL']
  globals: (text, protocol) => {
    const data = dumps(literalEval(text), protocol);
    const found = genops(data).filter((o) => o.info.name === 'GLOBAL').map((o) => pyRepr(o.arg));
    return { __pyRaw: '[' + found.join(', ') + ']' };
  },
};
