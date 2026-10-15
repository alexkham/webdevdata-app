// utils/emulators/python/stdlib/subprocess/calledprocesserror.js
//
// Emulator for the CalledProcessError demo tabs: the exact __str__ from
// Lib/subprocess.py (_subprocess.js). Negative codes are named with the
// Linux signal table — see the demo explainer.

import { num, repr, calledProcessError, calledProcessErrorStr } from './_subprocess.js';

export default {
  // raise subprocess.CalledProcessError(code, cmd)
  message: (code, cmd) => {
    num(code);
    throw calledProcessError(code, cmd);
  },

  // e = subprocess.CalledProcessError(code, cmd, output=out)
  // (e.returncode, e.cmd, e.stdout, str(e))
  attributes: (code, cmd, out) => {
    num(code);
    return { __pyTuple: [{ __pyRaw: repr(code) }, cmd, out, calledProcessErrorStr(code, cmd)] };
  },
};
