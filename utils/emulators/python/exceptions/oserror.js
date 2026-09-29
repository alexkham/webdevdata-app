// utils/emulators/python/exceptions/oserror.js
//
// Emulator for the OSError demo modes.
//   raise  — OSError(errno, strerror, filename): OSError_str formats
//            "[Errno N] strerror: repr(filename)", dropping the filename
//            part when it is None; oserror_init cuts args down to
//            (errno, strerror) only when a non-None filename was given.
//            The subclass mapping does not show (str() and args only),
//            which keeps the demo platform-independent.
//   handle — a virtual directory holding only report_1.txt; open() of any
//            other report_N.txt fails with ENOENT, caught as OSError.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

const FILES = { 'report_1.txt': 'Q1 figures' };

const openRead = (name) => {
  if (Object.prototype.hasOwnProperty.call(FILES, name)) return FILES[name];
  return raise('FileNotFoundError', `[Errno 2] No such file or directory: ${pyRepr(name)}`);
};

export default {
  raise: (errno, strerror, filename) => {
    const args = filename === null ? [errno, strerror, null] : [errno, strerror];
    const str = filename === null
      ? `[Errno ${pyRepr(errno)}] ${strerror}`
      : `[Errno ${pyRepr(errno)}] ${strerror}: ${pyRepr(filename)}`;
    return { __pyTuple: [{ __pyTuple: args }, str] };
  },

  handle: (n) => {
    const name = `report_${n}.txt`;
    try {
      return openRead(name);
    } catch (e) {
      // (type(e).__name__, e.errno, e.strerror, e.filename)
      return { __pyTuple: [e.name, 2, 'No such file or directory', name] };
    }
  },
};
