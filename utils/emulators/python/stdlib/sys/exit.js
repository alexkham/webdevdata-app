// utils/emulators/python/stdlib/sys/exit.js
//
// Emulator for the sys.exit demo: sys.exit(arg) raises SystemExit(arg); the
// inner finally runs first, then except SystemExit sees e.code == arg.

import { pyLiteralOf } from './_pysys.js';

export default {
  exit: (arg) => {
    const log = [];
    let lit;
    try {
      lit = pyLiteralOf(arg); // evaluating the argument (Infinity is a NameError)
    } finally {
      log.push('finally ran');
    }
    log.push(`caught SystemExit, code=${lit.repr}`);
    return log;
  },
};
