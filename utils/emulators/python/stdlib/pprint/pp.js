// utils/emulators/python/stdlib/pprint/pp.js
//
// Emulator for the pprint.pp demo, on the Lib/pprint.py port in
// _pypprint.js: pp and pprint print the same value one after the other,
// then the snippet's last call returns None.

import { literalEval } from '../pickle/_pyliteral.js';
import { pprintText, ppText, withStdout } from './_pypprint.js';

export default {
  // data = ast.literal_eval(data)
  // pprint.pp(data, width=width)
  // pprint.pprint(data, width=width)
  both: (data, width) => {
    const value = literalEval(data);
    return withStdout(ppText(value, { width }) + pprintText(value, { width }), 'None');
  },

  // pprint.pp(ast.literal_eval(data), depth=depth)
  depth: (data, depth) => withStdout(ppText(literalEval(data), { depth }), 'None'),
};
