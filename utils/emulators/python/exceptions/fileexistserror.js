// utils/emulators/python/exceptions/fileexistserror.js
//
// Emulator for the FileExistsError demo modes. Each snippet starts from an
// empty working directory and creates one entry itself (draft_1.txt or the
// folder run_1); creating that same name again fails with EEXIST.
//   trigger — open(name, 'x').write('new draft') returns the number of
//             characters written, or "[Errno 17] File exists: repr(name)"
//             (open() uses the C-runtime errno text on every platform).
//   handle  — os.mkdir; the demo only shows e.filename, never the
//             platform-specific message.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

const EEXIST_MSG = 'File exists';

const createExclusive = (existing, name) => {
  if (existing.has(name)) raise('FileExistsError', `[Errno 17] ${EEXIST_MSG}: ${pyRepr(name)}`);
  existing.add(name);
};

export default {
  trigger: (n) => {
    const name = `draft_${n}.txt`;
    createExclusive(new Set(['draft_1.txt']), name);
    return 'new draft'.length;
  },

  raise: (path) => raise(
    'FileExistsError',
    path === null ? `[Errno 17] ${EEXIST_MSG}` : `[Errno 17] ${EEXIST_MSG}: ${pyRepr(path)}`,
  ),

  handle: (n) => {
    const name = `run_${n}`;
    try {
      createExclusive(new Set(['run_1']), name);
      return 'created';
    } catch (e) {
      return `${name} already exists`;
    }
  },
};
