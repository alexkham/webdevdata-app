// utils/emulators/python/stdlib/shlex/index.js
//
// Emulator for the shlex module hub demo (split, join, quote), on the
// CPython port in _pyshlex.js.

import { split, join, quote } from './_pyshlex.js';

export default {
  // shlex.split(cmd)
  split: (cmd) => split(cmd),

  // shlex.join(args)
  join: (args) => join(args),

  // shlex.quote(arg)
  quote: (arg) => quote(arg),
};
