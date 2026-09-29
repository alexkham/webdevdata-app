// utils/emulators/python/exceptions/warning.js
//
// Emulator for the Warning demo modes.
//
//   trigger — warnings.simplefilter(action) inside catch_warnings(record=
//             True), then the same warnings.warn() call runs 3 times. The
//             action decides what is recorded:
//               'always'                    → every call (3)
//               'default' | 'module' | 'once' → first occurrence only (1):
//                   same text, category and line — all three agree here
//               'ignore'                    → nothing
//               'error'                     → the first call raises the
//                                             warning as an exception
//             Any other string: simplefilter raises ValueError (3.13).
//   handle  — simplefilter('error') turns warn() into a raise; the
//             RuntimeWarning is caught with except Warning.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

export const ACTIONS = ['error', 'ignore', 'always', 'default', 'module', 'once'];

export function checkAction(action) {
  if (!ACTIONS.includes(action)) raise('ValueError', `invalid action: ${pyRepr(action)}`);
}

export default {
  trigger: (action) => {
    checkAction(action);
    const caught = [];
    for (let i = 0; i < 3; i += 1) {
      if (action === 'error') raise('UserWarning', 'old API');
      if (action === 'ignore') continue;
      if (action === 'always' || caught.length === 0) caught.push('old API');
    }
    return caught;
  },

  // str(e) of a warning built from one string argument is that string
  handle: (msg) => `caught RuntimeWarning: ${msg}`,
};
