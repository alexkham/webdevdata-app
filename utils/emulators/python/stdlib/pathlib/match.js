// utils/emulators/python/stdlib/pathlib/match.js
//
// Emulator for the match / full_match demo, on _pypath.js (a port of
// glob.translate and fnmatch._translate).

import { pure, tuple } from './_pypath.js';

export default {
  // p = PurePosixPath(path); (p.match(pattern), p.full_match(pattern))
  both: (path, pattern) => {
    const p = pure(path);
    return tuple(p.match(pattern), p.fullMatch(pattern));
  },
};
