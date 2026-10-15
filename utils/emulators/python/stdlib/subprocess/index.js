// utils/emulators/python/stdlib/subprocess/index.js
//
// Emulator for the subprocess module hub demo, on the pure ports in
// _subprocess.js. No process is started: 'result' builds the
// CompletedProcess that run() would return and applies check_returncode;
// 'cmdline' is list2cmdline, the Windows argv → command-line conversion.

import { num, checkReturncode, completedProcessRepr, list2cmdline } from './_subprocess.js';

export default {
  // done = subprocess.CompletedProcess(args, code, stdout=out)
  // done.check_returncode(); done
  result: (args, code, out) => {
    num(code); // the literal itself (inf is a NameError)
    checkReturncode(args, code);
    return { __pyRaw: completedProcessRepr(args, code, out) };
  },

  // subprocess.list2cmdline(args)
  cmdline: (args) => list2cmdline(args),
};
