// utils/emulators/python/exceptions/assertionerror.js
//
// Emulator for the AssertionError demo modes: an assert with a message
// guarding a range. The message is the f-string, i.e. str(age).

import { raise } from '../../../py-exceptions.js';

// str() of the substituted literal. Numbers below 1e21 are written as
// Python int literals; from 1e21 up JS writes exponent form, which Python
// reads as a float whose str() is the same text (shortest round-trip).
function setAge(age) {
  if (!Number.isFinite(age)) raise('NameError', "name 'inf' is not defined");
  if (!(age >= 0 && age <= 150)) raise('AssertionError', `age out of range: ${String(age)}`);
  return age;
}

export default {
  trigger: (age) => setAge(age),

  handle: (age) => {
    try {
      return setAge(age);
    } catch (e) {
      if (e.name !== 'AssertionError') throw e;
      return `rejected: ${e.message}`;
    }
  },
};
