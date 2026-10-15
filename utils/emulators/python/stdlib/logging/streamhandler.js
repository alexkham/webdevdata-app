// utils/emulators/python/stdlib/logging/streamhandler.js
//
// Emulator for the logging.StreamHandler demo, on the port in
// _pylogging.js: the terminator written after every formatted record,
// and setStream returning the old stream (None when it is unchanged).

import { fresh, py, show } from './_demo.js';
import { INFO, StringIO, PyDict, tuple } from './_pylogging.js';
import { raise, pyRepr } from './_pyfmt.js';

export default {
  terminator: (terminator) => {
    const L = fresh();
    const log = L.getLogger('console');
    log.setLevel(INFO);
    log.propagate = false;
    const stream = new StringIO();
    const handler = L.StreamHandler(stream);
    handler.terminator = py(terminator);
    log.addHandler(handler);
    try {
      for (const step of ['download', 'unpack', 'install']) log.info('%s done', step);
    } finally {
      log.removeHandler(handler);
    }
    return stream.getvalue();
  },

  switch: (target) => {
    const L = fresh();
    const log = L.getLogger('console.switch');
    log.setLevel(INFO);
    log.propagate = false;
    const streams = new PyDict([['a', new StringIO()], ['b', new StringIO()]]);
    const handler = L.StreamHandler(streams.get('a'));
    log.addHandler(handler);
    let old;
    try {
      log.info('one');
      const k = py(target);
      if (!streams.has(k)) raise('KeyError', pyRepr(k));
      old = handler.setStream(streams.get(k));
      log.info('two');
    } finally {
      log.removeHandler(handler);
    }
    return show(tuple(old === streams.get('a'), streams.get('a').getvalue(), streams.get('b').getvalue()));
  },
};
