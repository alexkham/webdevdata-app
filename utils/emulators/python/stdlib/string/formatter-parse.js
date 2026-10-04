// utils/emulators/python/stdlib/string/formatter-parse.js
//
// Emulator for the Formatter.parse demo tabs, on the port in _pystring.js.

import { Formatter, parseTuple } from './_pystring.js';

export default {
  // list(string.Formatter().parse(fmt))
  parse: (fmt) => [...new Formatter().parse(fmt)].map(parseTuple),

  // [name for _, name, _, _ in string.Formatter().parse(fmt) if name is not None]
  names: (fmt) => [...new Formatter().parse(fmt)].map((t) => t[1]).filter((n) => n !== null),
};
