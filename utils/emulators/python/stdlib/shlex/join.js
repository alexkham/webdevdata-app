// utils/emulators/python/stdlib/shlex/join.js
//
// Emulator for the shlex.join demo tabs, on the CPython port in
// _pyshlex.js.

import { join, split } from './_pyshlex.js';

export default {
  // shlex.join(args)
  join: (args) => join(args),

  // shlex.split(shlex.join(args))
  roundtrip: (args) => split(join(args)),
};
