// utils/emulators/python/stdlib/contextlib/closing.js
//
// Emulator for the contextlib.closing demo tab, on the port of closing and
// the with statement in _pycontextlib.js.

import { closing, withStmt, tryExcept } from './_pycontextlib.js';
import { floorDivLit } from './_demo.js';

export default {
  // class Connection: close() logs 'closed <name>'
  // try: with closing(Connection(name)) as conn: log query, log 100 // n
  // except ZeroDivisionError: log 'error escaped'
  close: (name, n) => {
    const log = [];
    const conn = { name, close() { log.push('closed ' + this.name); return null; } };
    tryExcept(
      () => withStmt(new closing(conn), (c) => {
        log.push('query on ' + c.name);
        log.push(floorDivLit(n));
      }),
      'ZeroDivisionError',
      () => log.push('error escaped'),
    );
    return log;
  },
};
