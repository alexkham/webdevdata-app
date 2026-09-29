// utils/emulators/python/exceptions/notadirectoryerror.js
//
// Emulator for the NotADirectoryError demo modes.
//   trigger — OSError(errno.ENOTDIR, 'Not a directory', path): the
//             constructor returns NotADirectoryError; ENOTDIR is 20 on
//             Linux, macOS and Windows. filename None drops ": path".
//   raise   — NotADirectoryError(message): one argument, errno/strerror None.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

export default {
  trigger: (path) => raise(
    'NotADirectoryError',
    path === null ? '[Errno 20] Not a directory' : `[Errno 20] Not a directory: ${pyRepr(path)}`,
  ),

  raise: (message) => ({ __pyTuple: [null, null, message] }),
};
