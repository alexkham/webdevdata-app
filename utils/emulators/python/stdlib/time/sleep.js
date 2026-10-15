// utils/emulators/python/stdlib/time/sleep.js
//
// Emulator for the time.sleep demo, on _pytime.js: the argument is checked
// and converted exactly as CPython does it, but the demo never waits.

import * as T from './_pytime.js';

export default {
  // time.sleep(seconds)
  check: (seconds) => T.sleep(T.arg(seconds)),
};
