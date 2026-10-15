// utils/emulators/python/stdlib/subprocess/subprocesserror.js
//
// Emulator for the SubprocessError demo: raise one of three prepared
// exceptions (picked by key, as the snippet's dict does) and report which
// handler catches it. CalledProcessError and TimeoutExpired derive from
// SubprocessError; FileNotFoundError (a missing program) is an OSError.
// Messages come from the exact __str__ ports in _subprocess.js.

import { repr, calledProcessErrorStr, timeoutExpiredStr } from './_subprocess.js';
import { raise } from '../../../../py-exceptions.js';

// the snippet's dict, in its order
const ERRORS = {
  'exit status': () => ['except SubprocessError', 'CalledProcessError', calledProcessErrorStr(1, ['grep', 'TODO', 'notes.txt'])],
  timeout: () => ['except SubprocessError', 'TimeoutExpired', timeoutExpiredStr(['sleep', '60'], 5)],
  // str(FileNotFoundError(2, 'No such file or directory'))
  'missing program': () => ['except OSError', 'FileNotFoundError', '[Errno 2] No such file or directory'],
};

export default {
  catch: (what) => {
    if (typeof what !== 'string' || !Object.prototype.hasOwnProperty.call(ERRORS, what)) {
      raise('KeyError', repr(what)); // raised inside try, caught by neither handler
    }
    return { __pyTuple: ERRORS[what]() };
  },
};
