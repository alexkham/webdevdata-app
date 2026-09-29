// utils/emulators/python/exceptions/nameerror.js
//
// Emulator for the NameError demo modes: `kind` is bound only when the
// if body runs (n > 0); reading it otherwise is a NameError. 'kind' is not
// a stdlib module name, so no "Did you forget to import" hint is added.

import { raise } from '../../../py-exceptions.js';

const lookupKind = (n) => {
  if (n > 0) return 'positive';
  return raise('NameError', "name 'kind' is not defined");
};

export default {
  trigger: (n) => lookupKind(n),

  handle: (n) => {
    try {
      return lookupKind(n);
    } catch (e) {
      return 'undefined: kind'; // f'undefined: {e.name}'
    }
  },
};
