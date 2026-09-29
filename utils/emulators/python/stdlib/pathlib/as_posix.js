// utils/emulators/python/stdlib/pathlib/as_posix.js
//
// Emulator for the as_posix / as_uri demo, on _pypath.js.

import { pure, tuple } from './_pypath.js';

export default {
  // p = PurePosixPath(path); (p.as_posix(), p.as_uri())
  uri: (path) => {
    const p = pure(path);
    return tuple(p.asPosix(), p.asUri());
  },
};
