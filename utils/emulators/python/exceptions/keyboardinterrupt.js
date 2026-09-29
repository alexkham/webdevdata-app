// utils/emulators/python/exceptions/keyboardinterrupt.js
//
// Emulator for the KeyboardInterrupt demo modes: a five-step loop where
// step `stop_at` raises KeyboardInterrupt (standing in for Ctrl+C).
//   trigger — step `bad_at` raises ValueError, which the inner
//             `except Exception` skips; KeyboardInterrupt goes past it to
//             the outer `except KeyboardInterrupt` and ends the loop
//   handle  — top-level except KeyboardInterrupt plus finally cleanup
//
// `i == x` in Python: an int never equals a huge float like 1e+21, and JS
// === on the coerced numbers gives the same answer.

const STEPS = 5;

export default {
  trigger: (badAt, stopAt) => {
    const log = [];
    for (let i = 0; i < STEPS; i += 1) {
      if (i === badAt) {
        log.push('skipped');
        continue;
      }
      if (i === stopAt) {
        log.push('stopped');
        return log;
      }
      log.push(i);
    }
    return log;
  },

  handle: (stopAt) => {
    const log = [];
    let interrupted = false;
    for (let i = 0; i < STEPS; i += 1) {
      if (i === stopAt) {
        interrupted = true;
        break;
      }
      log.push(i);
    }
    if (interrupted) log.push('interrupted');
    log.push('cleanup');
    return log;
  },
};
