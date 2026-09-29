// utils/emulators/python/exceptions/referenceerror.js
//
// Emulator for the ReferenceError demo modes. Each Session object is kept
// alive only by its entry in the sessions dict; the proxy is weak. Deleting
// alice's entry drops her last strong reference, so the object is freed
// (immediately under CPython refcounting; gc.collect() makes it certain
// elsewhere) and any use of the proxy raises ReferenceError.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

function run(drop) {
  const sessions = new Map([['alice', { user: 'alice' }], ['bob', { user: 'bob' }]]);
  const watched = 'alice'; // watch = weakref.proxy(sessions['alice'])
  if (!sessions.has(drop)) raise('KeyError', pyRepr(drop));
  sessions.delete(drop);
  // strong references to the watched object left after the del
  const alive = sessions.has(watched);
  return () => {
    if (!alive) raise('ReferenceError', 'weakly-referenced object no longer exists');
    return 'alice';
  };
}

export default {
  trigger: (drop) => run(drop)(),

  handle: (drop) => {
    const user = run(drop); // the KeyError, if any, is outside the try
    try {
      return user();
    } catch (e) {
      if (e.name !== 'ReferenceError') throw e;
      return 'session expired';
    }
  },
};
