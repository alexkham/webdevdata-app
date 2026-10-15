// utils/emulators/python/stdlib/logging/exception.js
//
// Emulator for the logging.exception demo: Logger.exception inside an
// except block (exc_info from the exception being handled) and exc_info=
// an exception instance that was never raised, on _pylogging.js.

import { fresh, py, stringHandler, splitlines } from './_demo.js';
import { PyExc, kw, PyDict, pyRepr } from './_pylogging.js';

function jobsLogger(L) {
  const log = L.getLogger('jobs');
  log.setLevel(10n);
  log.propagate = false;
  const [handler, stream] = stringHandler(L, '%(levelname)s %(message)s');
  log.addHandler(handler);
  return [log, handler, stream];
}

export default {
  // config = {'host': 'db1', 'port': 5432}; value = config[key] in try/except KeyError
  catch: (key) => {
    const L = fresh();
    const k = py(key);
    const [log, handler, stream] = jobsLogger(L);
    const config = new PyDict([['host', 'db1'], ['port', 5432n]]);
    try {
      if (!config.has(k)) {
        L.handling(new PyExc('KeyError', pyRepr(k)), () => log.exception('missing setting %r', k));
      }
    } finally {
      log.removeHandler(handler);
    }
    return splitlines(stream.getvalue()).filter((line) => !line.startsWith(' '));
  },

  // log.error('rejected upload', exc_info=ValueError(text))
  instance: (text) => {
    const L = fresh();
    const [log, handler, stream] = jobsLogger(L);
    try {
      log.error('rejected upload', kw({ exc_info: new PyExc('ValueError', py(text), { raised: false }) }));
    } finally {
      log.removeHandler(handler);
    }
    return splitlines(stream.getvalue());
  },
};
