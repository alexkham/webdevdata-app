// utils/emulators/python/stdlib/os-path/basename.js
//
// Emulator for the os.path.basename / dirname demo (posixpath port).

import { basename, dirname, tuple } from './_posixpath.js';

export default {
  parts: (p) => tuple(dirname(p), basename(p)),

  // keep applying dirname until it stops changing
  up: (p) => {
    const chain = [p];
    while (dirname(p) !== p) {
      p = dirname(p);
      chain.push(p);
    }
    return chain;
  },
};
