// utils/emulators/python/stdlib/contextlib/contextmanager.js
//
// Emulator for the contextlib.contextmanager demo tabs. Each snippet's
// generator function is a JS generator driven by the port of
// _GeneratorContextManager in _pycontextlib.js (next / throw / close with
// CPython's states), so "generator didn't yield / didn't stop" and the
// exception paths come from the same code as in CPython.

import { contextmanager, withStmt, tryExcept, isinstance } from './_pycontextlib.js';
import { floorDivLit, rangeBound, str } from './_demo.js';

export default {
  // @contextmanager step(name): setup / try: yield name
  //   except ZeroDivisionError as e: log handled / finally: teardown
  // with step(name) as s: log body, log 100 // n
  trace: (name, n) => {
    const log = [];
    const step = contextmanager(function* step(nm) {
      log.push('setup ' + nm);
      try {
        yield nm;
      } catch (e) {
        if (!isinstance(e, 'ZeroDivisionError')) throw e;
        log.push(`handled: ${str(e)}`);
      } finally {
        log.push('teardown ' + nm);
      }
    });
    withStmt(step(name), (s) => {
      log.push('body ' + s);
      log.push(floorDivLit(n));
    });
    return log;
  },

  // @contextmanager resource(): for i in range(count): yield i
  // with resource() as value: pass
  // value
  yields: (count) => {
    const resource = contextmanager(function* resource() {
      const stop = rangeBound(count);
      for (let i = 0n; i < stop; i++) yield i;
    });
    return withStmt(resource(), (value) => value).value;
  },

  // @contextmanager step(): setup / yield / teardown   (no try/finally)
  // try: with step(): log 100 // n
  // except ZeroDivisionError: log caught outside
  nofinally: (n) => {
    const log = [];
    const step = contextmanager(function* step() {
      log.push('setup');
      yield;
      log.push('teardown');
    });
    tryExcept(
      () => withStmt(step(), () => { log.push(floorDivLit(n)); }),
      'ZeroDivisionError',
      () => log.push('caught outside'),
    );
    return log;
  },
};
