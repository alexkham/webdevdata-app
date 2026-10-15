// utils/emulators/python/stdlib/subprocess/completedprocess.js
//
// Emulator for the CompletedProcess demo tabs (_subprocess.js): the exact
// __repr__ (stdout/stderr left out when None) and check_returncode().

import { num, repr, truthy, completedProcessRepr } from './_subprocess.js';

export default {
  // subprocess.CompletedProcess(args, code, out, err)
  repr: (args, code, out, err) => {
    num(code);
    return { __pyRaw: completedProcessRepr(args, code, out, err) };
  },

  // done.check_returncode() inside try/except CalledProcessError:
  // (e.returncode, e.cmd, e.stdout, e.stderr) — or a note when nothing raised
  check: (args, code, out, err) => {
    num(code);
    if (truthy(code)) return { __pyTuple: [{ __pyRaw: repr(code) }, args, out, err] };
    return 'returncode is 0: nothing raised';
  },
};
