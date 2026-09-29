// utils/emulators/python/exceptions/connectionerror.js
//
// Emulator for the ConnectionError demo modes.
//   trigger — codes[kind] then OSError(code, 'simulated'): the constructor
//             maps EPIPE / ECONNABORTED / ECONNREFUSED / ECONNRESET to the
//             four subclasses, all of which are ConnectionErrors. An unknown
//             kind is a KeyError from the dict lookup (message = repr(key)).
//   handle  — kinds[kind]('simulated') raised inside try; ConnectionError
//             subclasses are caught, TimeoutError (a sibling under OSError)
//             escapes, an unknown kind escapes as KeyError.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

const hasKey = (obj, k) => Object.prototype.hasOwnProperty.call(obj, k);

// errno constant name → the class OSError(...) returns for it
const BY_ERRNO_KIND = {
  pipe:    'BrokenPipeError',
  aborted: 'ConnectionAbortedError',
  refused: 'ConnectionRefusedError',
  reset:   'ConnectionResetError',
};

const CLASSES = {
  reset:   'ConnectionResetError',
  refused: 'ConnectionRefusedError',
  aborted: 'ConnectionAbortedError',
  pipe:    'BrokenPipeError',
  timeout: 'TimeoutError',
};
const CONNECTION_ERRORS = new Set(['BrokenPipeError', 'ConnectionAbortedError', 'ConnectionRefusedError', 'ConnectionResetError']);

export default {
  trigger: (kind) => {
    if (!hasKey(BY_ERRNO_KIND, kind)) raise('KeyError', pyRepr(kind));
    const cls = BY_ERRNO_KIND[kind];
    return { __pyTuple: [cls, CONNECTION_ERRORS.has(cls)] };
  },

  handle: (kind) => {
    if (!hasKey(CLASSES, kind)) raise('KeyError', pyRepr(kind));
    const cls = CLASSES[kind];
    if (!CONNECTION_ERRORS.has(cls)) raise(cls, 'simulated');
    return `reconnect after ${cls}`;
  },
};
