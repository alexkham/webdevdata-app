// utils/emulators/python/stdlib/logging/formattime.js
//
// Emulator for the Formatter.formatTime demo, on the port in
// _pylogging.js: a record with a fixed created / msecs, converter =
// time.gmtime (so no time zone is involved), strftime with datefmt or
// default_time_format + default_msec_format. strftime codes whose output
// differs between platforms stop the demo with a DemoLimit.

import { fresh, py } from './_demo.js';
import { PyDict, PyFloat } from './_pylogging.js';

function record(L, created, msecs) {
  return L.makeLogRecord(new PyDict([['msg', 'backup finished'], ['created', new PyFloat(created)], ['msecs', new PyFloat(msecs)]]));
}

export default {
  datefmt: (datefmt) => {
    const L = fresh();
    const formatter = L.Formatter('%(asctime)s %(message)s', py(datefmt));
    formatter.converter = 'gmtime';
    return formatter.format(record(L, 1700000000.25, 250.0));
  },

  msec: (msecFormat) => {
    const L = fresh();
    const formatter = L.Formatter('%(asctime)s %(message)s');
    formatter.converter = 'gmtime';
    formatter.default_msec_format = py(msecFormat);
    return formatter.format(record(L, 1700000000.007, 7.0));
  },
};
