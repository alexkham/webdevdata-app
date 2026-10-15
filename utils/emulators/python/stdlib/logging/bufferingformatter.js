// utils/emulators/python/stdlib/logging/bufferingformatter.js
//
// Emulator for the logging.BufferingFormatter demo, on the port in
// _pylogging.js: a subclass whose formatHeader counts the records and
// whose formatFooter is fixed, over records made with makeLogRecord.

import { fresh, py } from './_demo.js';
import { PyDict } from './_pylogging.js';

export default {
  batch: (messages, linefmt) => {
    const L = fresh();
    const report = L.BufferingFormatter(L.Formatter(py(linefmt)));
    // class Report(logging.BufferingFormatter): formatHeader / formatFooter
    report.formatHeader = (records) => `${records.length} problem(s):\n`;
    report.formatFooter = () => '-- end of report --';
    const records = py(messages).map((m) => L.makeLogRecord(new PyDict([['msg', m], ['levelname', 'WARNING']])));
    return report.format(records);
  },
};
