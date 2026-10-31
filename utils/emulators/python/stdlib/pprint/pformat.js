// utils/emulators/python/stdlib/pprint/pformat.js
//
// Emulator for the pprint.pformat demo tabs, on the Lib/pprint.py port in
// _pypprint.js (values read with the ast.literal_eval port).

import { literalEval } from '../pickle/_pyliteral.js';
import { pformat, splitLines } from './_pypprint.js';

export default {
  // data = ast.literal_eval(data)
  // pprint.pformat(data, width=width).splitlines()
  pformat: (data, width) => splitLines(pformat(literalEval(data), { width })),

  // (pprint.pformat(data, width=width).count('\n') + 1,
  //  pprint.pformat(data, width=width, compact=True).splitlines())
  compact: (data, width) => {
    const value = literalEval(data);
    const plain = splitLines(pformat(value, { width })).length;
    return { __pyTuple: [{ __pyRaw: String(plain) }, splitLines(pformat(value, { width, compact: true }))] };
  },

  // pprint.pformat(ast.literal_eval(data), underscore_numbers=True)
  underscore: (data) => pformat(literalEval(data), { underscore_numbers: true }),
};
