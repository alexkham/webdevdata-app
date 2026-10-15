// utils/emulators/python/stdlib/textwrap/wrap.js
//
// Emulator for the textwrap.wrap demo tabs, on the CPython port in
// _pytextwrap.js. Numbers are the Python values of the literals the code
// shows (numArg); arguments are evaluated left to right, like CPython.

import { wrap, numArg } from './_pytextwrap.js';

const tuple = (...items) => ({ __pyTuple: items });

export default {
  // textwrap.wrap(text, width=width)
  wrap: (text, width) => wrap(text, numArg(width)),

  // (textwrap.wrap(text, width=width),
  //  textwrap.wrap(text, width=width, break_on_hyphens=False))
  hyphens: (text, width) => {
    const a = wrap(text, numArg(width));
    return tuple(a, wrap(text, numArg(width), { break_on_hyphens: false }));
  },

  // (textwrap.wrap(text, width=width),
  //  textwrap.wrap(text, width=width, break_long_words=False))
  long: (text, width) => {
    const a = wrap(text, numArg(width));
    return tuple(a, wrap(text, numArg(width), { break_long_words: false }));
  },

  // textwrap.wrap(text, width=width, initial_indent=first, subsequent_indent=rest)
  indent: (text, width, first, rest) => wrap(text, numArg(width), { initial_indent: first, subsequent_indent: rest }),
};
