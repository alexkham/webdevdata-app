// utils/emulators/python/exceptions/baseexception.js
//
// Emulator for the BaseException demo modes.
//   raise  — BaseException(*args): args tuple and str(e) (BaseException_str:
//            no args → '', one → str(arg), several → repr(args))
//   handle — which of `except Exception` / `except BaseException` catches a
//            given class. The hierarchy facts below are the real ones.

import { excStr } from '../../../py-exceptions.js';

// class name → is it a subclass of Exception? (the demo's `kinds` dict)
const KINDS = {
  ValueError: true,
  KeyboardInterrupt: false,
  SystemExit: false,
  GeneratorExit: false,
};

export default {
  raise: (args) => ({ __pyTuple: [{ __pyTuple: args }, excStr(args)] }),

  handle: (name) => {
    // kinds[name] is evaluated inside the inner try: a missing name raises
    // KeyError there, and KeyError is an Exception.
    if (!Object.prototype.hasOwnProperty.call(KINDS, name)) {
      return 'except Exception';
    }
    return KINDS[name] ? 'except Exception' : 'except BaseException';
  },
};
