// utils/emulators/python/exceptions/lookuperror.js
//
// Emulator for the LookupError demo modes: data[key][index] on a dict of
// lists. The key lookup can raise KeyError (message repr(key)); the list
// index can raise IndexError. Both are LookupErrors.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

const DATA = { users: ['ann', 'bob'], admins: [] };

const lookup = (key, index) => {
  if (!Object.prototype.hasOwnProperty.call(DATA, key)) raise('KeyError', pyRepr(key));
  const list = DATA[key];
  // The snippet shows the index as pyRepr(index); from 1e21 up that is
  // float syntax (1e+21), and a float is not a valid list index.
  if (/[.e]/.test(pyRepr(index))) raise('TypeError', 'list indices must be integers or slices, not float');
  const i = index < 0 ? index + list.length : index;
  if (i < 0 || i >= list.length) raise('IndexError', 'list index out of range');
  return list[i];
};

export default {
  trigger: (key, index) => lookup(key, index),

  handle: (key, index) => {
    try {
      return lookup(key, index);
    } catch (e) {
      if (e.name === 'KeyError' || e.name === 'IndexError') return `${e.name}: ${e.message}`;
      throw e;
    }
  },
};
