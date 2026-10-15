// utils/emulators/python/stdlib/contextlib/index.js
//
// Emulator for the contextlib module hub demo, on the CPython port in
// _pycontextlib.js: the snippets' generator functions are JS generators
// driven by the ported _GeneratorContextManager, and the with statements
// run through withStmt.

import { contextmanager, suppress, withStmt, tryExcept, makeSys, print, withScreen } from './_pycontextlib.js';
import { floorDivLit, getItem, str } from './_demo.js';

export default {
  // @contextmanager opened(name): log open / yield name / finally log close
  // try: with opened(name) as res: log use, log 100 // n
  // except ZeroDivisionError as e: log error
  contextmanager: (name, n) => {
    const log = [];
    const opened = contextmanager(function* opened(nm) {
      log.push('open ' + nm);
      try {
        yield nm;
      } finally {
        log.push('close ' + nm);
      }
    });
    tryExcept(
      () => withStmt(opened(name), (res) => {
        log.push('use ' + res);
        log.push(floorDivLit(n));
      }),
      'ZeroDivisionError',
      (e) => log.push(`error: ${str(e)}`),
    );
    return log;
  },

  // with suppress(KeyError): price = prices[item]; print('found it')
  suppress: (item) => {
    const sys = makeSys();
    const prices = new Map([['tea', 3n], ['cake', 5n]]);
    let price = null;
    withStmt(new suppress('KeyError'), () => {
      price = getItem(prices, item);
      print(sys, ['found it']);
    });
    return withScreen(sys, price);
  },
};
