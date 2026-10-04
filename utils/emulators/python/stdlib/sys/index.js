// utils/emulators/python/stdlib/sys/index.js
//
// Emulator for the sys module hub demo: a version check and the integer
// string conversion limit, on the shared pieces in _pysys.js.

import { atLeast } from './version.js';
import { convertedLength } from './set_int_max_str_digits.js';
import { DEFAULT_MAX_STR_DIGITS } from './_pysys.js';

export default {
  // sys.version_info >= (major, minor)
  version: (major, minor) => atLeast(major, minor),

  // n = int('9' * digits); len(str(n))
  limit: (digits) => convertedLength(digits, DEFAULT_MAX_STR_DIGITS),
};
