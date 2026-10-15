// utils/emulators/python/stdlib/contextlib/exitstack.js
//
// Emulator for the contextlib.ExitStack demo tabs, on the port of ExitStack
// (LIFO unwinding, callback, pop_all, close) and the with statement in
// _pycontextlib.js.

import { ExitStack, withStmt, tryExcept, exc } from './_pycontextlib.js';
import { str } from './_demo.js';

export default {
  // with ExitStack() as stack:
  //     for name in names: log open; stack.callback(log.append, 'close ' + name)
  //     log work
  callbacks: (names) => {
    const log = [];
    withStmt(new ExitStack(), (stack) => {
      for (const name of names) {
        log.push('open ' + name);
        stack.callback((x) => log.push(x), 'close ' + name);
      }
      log.push('work');
    });
    return log;
  },

  // def acquire(name): 'bad' raises OSError, else log open and return name
  // try: with ExitStack() as stack:
  //          for name in names: stack.callback(log.append, 'close ' + acquire(name))
  //          log all open
  // except OSError as e: log error
  partial: (names) => {
    const log = [];
    const acquire = (name) => {
      if (name === 'bad') throw exc('OSError', 'cannot open ' + name);
      log.push('open ' + name);
      return name;
    };
    tryExcept(
      () => withStmt(new ExitStack(), (stack) => {
        for (const name of names) stack.callback((x) => log.push(x), 'close ' + acquire(name));
        log.push('all open');
      }),
      'OSError',
      (e) => log.push(`error: ${str(e)}`),
    );
    return log;
  },

  // with ExitStack() as stack:
  //     for name in names: stack.callback(log.append, 'close ' + name)
  //     later = stack.pop_all()
  // log 'with block done'; later.close()
  popall: (names) => {
    const log = [];
    let later;
    withStmt(new ExitStack(), (stack) => {
      for (const name of names) stack.callback((x) => log.push(x), 'close ' + name);
      later = stack.pop_all();
    });
    log.push('with block done');
    later.close();
    return log;
  },
};
