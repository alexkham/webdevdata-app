// utils/emulators/python/stdlib/pprint/pprint.js
//
// Emulator for the pprint.pprint demo tabs, on the Lib/pprint.py port in
// _pypprint.js. pprint() prints and returns None: the demo output is the
// printed text, then that None.

import { literalEval } from '../pickle/_pyliteral.js';
import { pprintText, withStdout } from './_pypprint.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

export default {
  // data = ast.literal_eval(data)
  // pprint.pprint(data, width=width)
  print: (data, width) => withStdout(pprintText(literalEval(data), { width }), 'None'),

  // buf = io.StringIO()
  // pprint.pprint(ast.literal_eval(data), stream=buf, depth=depth)
  // buf.getvalue()
  stream: (data, depth) => ({ __pyRaw: pyStrRepr(pprintText(literalEval(data), { depth })) }),
};
