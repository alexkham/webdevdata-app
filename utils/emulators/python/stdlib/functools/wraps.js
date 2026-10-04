// utils/emulators/python/stdlib/functools/wraps.js
//
// Emulator for the functools.wraps demo tabs. The docstring literal goes
// through Python 3.13's compile-time docstring cleaning (cleanDoc, a port
// of _PyCompile_CleanDoc); with @wraps it is copied to the wrapper,
// without it the wrapper keeps its own (None) metadata.

import { cleanDoc, asPy, tuple } from './_pyfunctools.js';

export default {
  // greet.__name__, greet.__doc__   (with @functools.wraps(func))
  with: (doc) => asPy(tuple('greet', cleanDoc(doc))),

  // greet.__name__, greet.__doc__, greet.__qualname__   (no wraps)
  without: () => asPy(tuple('wrapper', null, 'logged.<locals>.wrapper')),
};
