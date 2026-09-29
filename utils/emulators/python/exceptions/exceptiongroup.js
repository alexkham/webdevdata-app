// utils/emulators/python/exceptions/exceptiongroup.js
//
// Emulator for the ExceptionGroup demo modes.
//   trigger — parse_all(values): int() every item, collect the ValueErrors,
//             raise them together as ExceptionGroup('bad values', errors);
//             caught with plain except ExceptionGroup
//   raise   — ExceptionGroup('batch', [ValueError(i) for i in range(n)]):
//             str(eg) is 'msg (N sub-exception[s])', empty list → ValueError
//   handle  — the same parse_all caught with except* ValueError

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise, pyInt } from '../../../py-exceptions.js';

// int(str) as CPython does it (see arithmeticerror.js): %.200R message
// truncation and the 4300-digit limit on top of pyInt's parse rules.
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

// → { nums } or { errors: [message, …] }
function parseAll(values) {
  const nums = [];
  const errors = [];
  for (const v of values) {
    try {
      nums.push(int(v));
    } catch (e) {
      errors.push(e.message);
    }
  }
  return errors.length > 0 ? { errors } : { nums };
}

const groupStr = (msg, n) => `${msg} (${n} sub-exception${n === 1 ? '' : 's'})`;
const valueErrorRepr = (msg) => ({ __pyRaw: `ValueError(${pyRepr(msg)})` });

export default {
  trigger: (values) => {
    const res = parseAll(values);
    if (!res.errors) return res.nums;
    return { __pyTuple: [groupStr('bad values', res.errors.length), { __pyTuple: res.errors.map(valueErrorRepr) }] };
  },

  raise: (n) => {
    // pyRepr(n) is what the snippet shows: from 1e21 up it is a float
    if (/[.e]/.test(pyRepr(n))) raise('TypeError', "'float' object cannot be interpreted as an integer");
    if (n <= 0) raise('ValueError', 'second argument (exceptions) must be a non-empty sequence');
    return groupStr('batch', n);
  },

  handle: (values) => {
    const res = parseAll(values);
    if (!res.errors) return res.nums;
    return res.errors;
  },
};
