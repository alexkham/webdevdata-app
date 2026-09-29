// utils/emulators/python/exceptions/isadirectoryerror.js
//
// Emulator for the IsADirectoryError demo modes.
//   trigger — OSError(errno.EISDIR, 'Is a directory', path): the constructor
//             returns IsADirectoryError; EISDIR is 21 on Linux, macOS and
//             Windows. filename None drops the ": path" suffix.
//   raise   — IsADirectoryError(message): one argument, errno/strerror None.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

export default {
  trigger: (path) => raise(
    'IsADirectoryError',
    path === null ? '[Errno 21] Is a directory' : `[Errno 21] Is a directory: ${pyRepr(path)}`,
  ),

  raise: (message) => ({ __pyTuple: [null, null, message] }),
};
