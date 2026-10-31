// utils/emulators/python/stdlib/tomllib/loads.js
//
// Emulator for the tomllib.loads demo tabs, on the CPython port in
// _pytomllib.js.

import { loads, asPy, joinLines, PARSE_FLOAT } from './_pytomllib.js';
import { pyStrRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

export default {
  // doc = '\n'.join([line1, ..., line4]); tomllib.loads(doc)
  parse: (l1, l2, l3, l4) => asPy(loads(joinLines(l1, l2, l3, l4))),

  // parsers = {'float': float, 'Decimal': Decimal, 'str': str}
  // tomllib.loads(text, parse_float=parsers[kind])
  floats: (text, kind) => {
    if (!Object.prototype.hasOwnProperty.call(PARSE_FLOAT, kind)) throw new PyException('KeyError', pyStrRepr(kind));
    return asPy(loads(text, { parseFloat: kind }));
  },
};
