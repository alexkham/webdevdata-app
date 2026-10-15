// utils/emulators/python/stdlib/time/get-clock-info.js
//
// Emulator for the time.get_clock_info demo, on _pytime.js. Only the two
// flags are shown: they are the same on Linux, macOS and Windows, while
// implementation and resolution are not.

import * as T from './_pytime.js';

export default {
  // info = time.get_clock_info(name)
  // (info.monotonic, info.adjustable)
  info: (name) => {
    const info = T.getClockInfo(name);
    return T.asPy(T.tuple(info.monotonic, info.adjustable));
  },
};
