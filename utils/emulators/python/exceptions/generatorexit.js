// utils/emulators/python/exceptions/generatorexit.js
//
// Emulator for the GeneratorExit demo modes.
//   trigger — close() after n next() calls: GeneratorExit is thrown in at
//             the paused yield only if the generator has started; closing
//             an unstarted generator runs none of its code
//   handle  — a collector generator that returns its list when closed;
//             close() hands that return value back (3.13+)

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

export default {
  trigger: (n) => {
    // pyRepr(n) is the literal in range(...): from 1e21 up it is a float
    if (/[.e]/.test(pyRepr(n))) raise('TypeError', "'float' object cannot be interpreted as an integer");
    const started = n > 0;
    return started ? ['GeneratorExit received'] : [];
  },

  handle: (lines) => [...lines],
};
