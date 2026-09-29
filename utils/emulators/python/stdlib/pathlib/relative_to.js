// utils/emulators/python/stdlib/pathlib/relative_to.js
//
// Emulator for the relative_to / is_relative_to demo, on _pypath.js.

import { pure, py } from './_pypath.js';

export default {
  relative: (path, other) => py(pure(path).relativeTo(other)),
  walkup: (path, other) => py(pure(path).relativeTo(other, { walkUp: true })),
  check: (path, other) => pure(path).isRelativeTo(other),
};
