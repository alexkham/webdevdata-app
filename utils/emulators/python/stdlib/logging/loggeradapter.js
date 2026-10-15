// utils/emulators/python/stdlib/logging/loggeradapter.js
//
// Emulator for the logging.LoggerAdapter demo, on the port in
// _pylogging.js: process() replacing or (merge_extra, 3.13) merging the
// call's extra, and a subclass whose process() prefixes the message.

import { fresh, py, splitlines } from './_demo.js';
import { INFO, StringIO, PyDict, kw, pyStr, truthy } from './_pylogging.js';

export default {
  extra: (merge, user) => {
    const L = fresh();
    const log = L.getLogger('api');
    log.setLevel(INFO);
    log.propagate = false;
    const stream = new StringIO();
    const handler = L.StreamHandler(stream);
    handler.setFormatter(L.Formatter('[%(request_id)s] [%(user)s] %(message)s', null, '%', true, { defaults: new PyDict([['request_id', '-'], ['user', '-']]) }));
    log.addHandler(handler);
    const adapter = L.LoggerAdapter(log, new PyDict([['request_id', 'r-17']]), truthy(py(merge)));
    try {
      adapter.info('request started');
      adapter.info('signed in', kw({ extra: new PyDict([['user', py(user)]]) }));
    } finally {
      log.removeHandler(handler);
    }
    return splitlines(stream.getvalue());
  },

  process: (job) => {
    const L = fresh();
    const log = L.getLogger('api.jobs');
    log.setLevel(INFO);
    log.propagate = false;
    const stream = new StringIO();
    const handler = L.StreamHandler(stream);
    log.addHandler(handler);
    const adapter = L.LoggerAdapter(log, new PyDict([['job', py(job)]]));
    // class JobAdapter(logging.LoggerAdapter):
    //     def process(self, msg, kwargs): return f"[{self.extra['job']}] {msg}", kwargs
    adapter.pyTypeName = 'JobAdapter';
    adapter.process = (msg, kwargs) => [`[${pyStr(adapter.extra.get('job'))}] ${pyStr(msg)}`, kwargs];
    try {
      adapter.warning('retry %d of %d', 2n, 3n);
      adapter.info('100% done');
    } finally {
      log.removeHandler(handler);
    }
    return splitlines(stream.getvalue());
  },
};
