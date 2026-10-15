// utils/emulators/python/stdlib/textwrap/shorten.js
//
// Emulator for the textwrap.shorten demo tabs, on the CPython port in
// _pytextwrap.js. Numbers are the Python values of the literals the code
// shows (numArg).

import { shorten, numArg } from './_pytextwrap.js';

export default {
  // textwrap.shorten(text, width=width)
  shorten: (text, width) => shorten(text, numArg(width)),

  // textwrap.shorten(text, width=width, placeholder=placeholder)
  placeholder: (text, width, placeholder) => shorten(text, numArg(width), { placeholder }),
};
