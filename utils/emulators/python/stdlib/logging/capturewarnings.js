// utils/emulators/python/stdlib/logging/capturewarnings.js
//
// Emulator for the logging.captureWarnings demo, on the port in
// _pylogging.js: with capture on, warnings.formatwarning's text is logged
// as the whole msg (no args, so a % is never interpreted) at WARNING on
// 'py.warnings'; with capture off the original showwarning writes the same
// text to stderr. The snippets use warnings.warn_explicit with the 'always'
// filter and a '<…>' file name, which linecache never reads, so there is
// no source line.

import { fresh, py, stringHandler, redirectStderr, splitlines, show } from './_demo.js';
import { NOTSET, PyDict, truthy } from './_pylogging.js';

export default {
  capture: (capture, message) => {
    const L = fresh();
    const log = L.getLogger('py.warnings');
    const [handler, stream] = stringHandler(L, '%(name)s %(levelname)s | %(message)s');
    log.addHandler(handler);
    L.captureWarnings(truthy(py(capture)));
    let err;
    try {
      err = redirectStderr(L, () => L.warnExplicit(py(message), 'UserWarning', '<config>', 12n));
    } finally {
      L.captureWarnings(false);
      log.removeHandler(handler);
    }
    return show(new PyDict([['logging', stream.getvalue()], ['stderr', err.getvalue()]]));
  },

  level: (level) => {
    const L = fresh();
    const log = L.getLogger('py.warnings');
    const [handler, stream] = stringHandler(L, '%(levelname)s %(message)s');
    log.addHandler(handler);
    try {
      log.setLevel(py(level));
      L.captureWarnings(true);
      L.warnExplicit('retrying in 5 s', 'RuntimeWarning', '<net>', 40n);
    } finally {
      L.captureWarnings(false);
      log.setLevel(NOTSET);
      log.removeHandler(handler);
    }
    return splitlines(stream.getvalue());
  },
};
