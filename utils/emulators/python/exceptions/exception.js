// utils/emulators/python/exceptions/exception.js
//
// Emulator for the Exception demo modes.
//   trigger — int(s) wrapped in `except Exception`, reporting the caught
//             exception as 'Type: message'
//   raise   — a custom Exception subclass with an extra attribute
//   handle  — handler order: the first matching except clause wins

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise, pyInt } from '../../../py-exceptions.js';

// int(str) with the two CPython details pyInt leaves out: the offending
// literal in the message is repr() cut to 200 characters (%.200R), and
// more than 4300 digits hit the int_max_str_digits limit.
function int(s) {
  let v;
  try {
    v = pyInt(s);
  } catch (e) {
    if (e.name !== 'ValueError') throw e;
    const shown = Array.from(pyRepr(String(s))).slice(0, 200).join('');
    return raise('ValueError', `invalid literal for int() with base 10: ${shown}`);
  }
  const digits = (String(s).match(/[0-9]/g) || []).length;
  if (digits > 4300) {
    raise('ValueError', `Exceeds the limit (4300 digits) for integer string conversion: value has ${digits} digits; use sys.set_int_max_str_digits() to increase the limit`);
  }
  return v;
}

// class name → its MRO names below Exception (AppError/NotFound are the
// demo's own classes: class AppError(Exception), class NotFound(AppError))
const KINDS = {
  NotFound: ['NotFound', 'AppError'],
  AppError: ['AppError'],
  ValueError: ['ValueError'],
};

export default {
  trigger: (text) => {
    try {
      return int(text);
    } catch (e) {
      return `${e.name}: ${e.message}`;
    }
  },

  raise: (key, problem) => ({ __pyTuple: [`${key}: ${problem}`, key, true] }),

  handle: (name) => {
    if (!Object.prototype.hasOwnProperty.call(KINDS, name)) {
      // kinds[name] raises KeyError inside the try — caught by except Exception
      return 'Exception handler';
    }
    const mro = KINDS[name];
    if (mro.includes('NotFound')) return 'NotFound handler';
    if (mro.includes('AppError')) return 'AppError handler';
    return 'Exception handler';
  },
};
