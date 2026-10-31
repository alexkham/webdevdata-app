// utils/emulators/python/stdlib/shlex/quote.js
//
// Emulator for the shlex.quote demo tabs, on the CPython port in
// _pyshlex.js.

import { quote, split } from './_pyshlex.js';

export default {
  // shlex.quote(arg)
  quote: (arg) => quote(arg),

  // command = 'ls -l {}'.format(shlex.quote(name)); shlex.split(command)
  command: (name) => split(`ls -l ${quote(name)}`),
};
