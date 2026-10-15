// utils/emulators/python/stdlib/hashlib/algorithms.js
//
// Emulator for the algorithms_guaranteed demo tabs, on the CPython port in
// _pyhashlib.js. algorithms_available is machine-dependent, so no tab
// shows its contents.

import { GUARANTEED, hashNew } from './_pyhashlib.js';

export default {
  // (name in hashlib.algorithms_guaranteed, hashlib.new(name).name)
  check: (name) => {
    const member = GUARANTEED.includes(name);
    return { __pyTuple: [member, hashNew(name).name] };
  },

  // sorted(n for n in hashlib.algorithms_guaranteed if n.startswith(prefix))
  prefix: (prefix) => GUARANTEED.filter((n) => n.startsWith(prefix)),
};
