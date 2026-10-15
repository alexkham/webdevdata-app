// utils/emulators/python/stdlib/textwrap/fill.js
//
// Emulator for the textwrap.fill demo tabs, on the CPython port in
// _pytextwrap.js. Numbers are the Python values of the literals the code
// shows (numArg).

import { fill, numArg, pyLen } from './_pytextwrap.js';

export default {
  // textwrap.fill(text, width=width)
  fill: (text, width) => fill(text, numArg(width)),

  // textwrap.fill(text, width=width, initial_indent=bullet,
  //               subsequent_indent=' ' * len(bullet))
  hanging: (text, width, bullet) => {
    const w = numArg(width);
    return fill(text, w, { initial_indent: bullet, subsequent_indent: ' '.repeat(pyLen(bullet)) });
  },
};
