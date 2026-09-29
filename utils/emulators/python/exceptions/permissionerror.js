// utils/emulators/python/exceptions/permissionerror.js
//
// Emulator for the PermissionError demo modes.
//   trigger — OSError(errno.EACCES, 'Permission denied', path): the
//             constructor returns PermissionError; EACCES is 13 on Linux,
//             macOS and Windows. filename None drops the ": path" suffix.
//   raise   — PermissionError(message): one argument, so errno/strerror are
//             None and str(e) is the message itself.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

export default {
  trigger: (path) => raise(
    'PermissionError',
    path === null ? '[Errno 13] Permission denied' : `[Errno 13] Permission denied: ${pyRepr(path)}`,
  ),

  raise: (message) => ({ __pyTuple: [null, null, message] }),
};
