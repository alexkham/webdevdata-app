// utils/emulators/python/stdlib/shlex/split.js
//
// Emulator for the shlex.split demo tabs, on the CPython port in
// _pyshlex.js.

import { split } from './_pyshlex.js';

export default {
  // shlex.split(cmd)
  posix: (cmd) => split(cmd),

  // shlex.split(cmd, comments=True)
  comments: (cmd) => split(cmd, true),

  // shlex.split(cmd, posix=False)
  nonposix: (cmd) => split(cmd, false, false),
};
