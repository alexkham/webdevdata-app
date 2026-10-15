// utils/emulators/python/stdlib/textwrap/index.js
//
// Emulator for the textwrap module hub demo (wrap, shorten, dedent), on the
// CPython port in _pytextwrap.js. A 'number' input is the Python value of
// the literal the code shows (numArg: int, float such as 1e+21, or a
// NameError for inf).

import { wrap, shorten, dedent, numArg } from './_pytextwrap.js';

export default {
  // textwrap.wrap(text, width=width)
  wrap: (text, width) => wrap(text, numArg(width)),

  // textwrap.shorten(text, width=width)
  shorten: (text, width) => shorten(text, numArg(width)),

  // textwrap.dedent(text.replace('|', '\n'))
  dedent: (text) => dedent(text.replaceAll('|', '\n')),
};
