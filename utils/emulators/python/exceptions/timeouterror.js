// utils/emulators/python/exceptions/timeouterror.js
//
// Emulator for the TimeoutError demo modes.
//   raise  — raise TimeoutError(message); str(e) is the message, an empty
//            one shows the bare class name (errorLine handles that).
//   handle — three attempts; attempt k (0-based) times out while
//            k < failures. Success returns 'ok on attempt N'; if all three
//            time out the loop keeps the last message.

import { raise } from '../../../py-exceptions.js';

const ATTEMPTS = 3;

export default {
  raise: (message) => raise('TimeoutError', message),

  handle: (failures) => {
    const fetch = (attempt) => {
      if (attempt < failures) raise('TimeoutError', `attempt ${attempt + 1} timed out`);
      return `ok on attempt ${attempt + 1}`;
    };
    let result;
    for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
      try {
        result = fetch(attempt);
        break;
      } catch (e) {
        result = `gave up: ${e.message}`;
      }
    }
    return result;
  },
};
