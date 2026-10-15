// utils/emulators/python/stdlib/subprocess/timeoutexpired.js
//
// Emulator for the TimeoutExpired demo tabs: the exact __str__ and the
// attributes (_subprocess.js). Captured output is bytes, as run() stores it.

import { num, repr, encodeUtf8, timeoutExpired, timeoutExpiredStr } from './_subprocess.js';

const literal = (v) => {
  if (typeof v === 'number') num(v); // inf is a NameError
};

export default {
  // raise subprocess.TimeoutExpired(cmd, timeout)
  message: (cmd, timeout) => {
    literal(timeout);
    throw timeoutExpired(cmd, timeout);
  },

  // e = subprocess.TimeoutExpired(cmd, timeout, output=out.encode())
  // (e.timeout, e.stdout, str(e))
  attributes: (cmd, timeout, out) => {
    literal(timeout);
    const output = encodeUtf8(out);
    return { __pyTuple: [{ __pyRaw: repr(timeout) }, { __pyRaw: repr(output) }, timeoutExpiredStr(cmd, timeout)] };
  },
};
