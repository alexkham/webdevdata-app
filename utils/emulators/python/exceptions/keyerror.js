// utils/emulators/python/exceptions/keyerror.js
//
// Emulator for the KeyError demo modes. KeyError's message is repr(key)
// (KeyError_str in CPython), which is the point the page teaches.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

const STOCK = { apple: 3, pear: 0 };

const lookup = (key) => {
  if (Object.prototype.hasOwnProperty.call(STOCK, key)) return STOCK[key];
  return raise('KeyError', pyRepr(key));
};

export default {
  trigger: (key) => lookup(key),

  raise: (key) => raise('KeyError', pyRepr(key)),

  handle: (key) => {
    try {
      return lookup(key);
    } catch (e) {
      // f'{e}' is str(e) — the quoted repr of the key
      return `no such item: ${e.message}`;
    }
  },
};
