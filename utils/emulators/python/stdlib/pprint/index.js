// utils/emulators/python/stdlib/pprint/index.js
//
// Emulator for the pprint module hub demo (width, indent / depth, compact),
// on the Lib/pprint.py port in _pypprint.js. The typed value is read with
// the ast.literal_eval port from the pickle demos.

import { literalEval } from '../pickle/_pyliteral.js';
import { pformat, splitLines } from './_pypprint.js';

export default {
  // data = ast.literal_eval(data)
  // pprint.pformat(data, width=width).splitlines()
  pformat: (data, width) => splitLines(pformat(literalEval(data), { width })),

  // pprint.pformat(data, indent=indent, width=width, depth=depth).splitlines()
  nesting: (data, indent, width, depth) => splitLines(pformat(literalEval(data), { indent, width, depth })),

  // pprint.pformat(data, width=width, compact=True).splitlines()
  compact: (data, width) => splitLines(pformat(literalEval(data), { width, compact: true })),
};
