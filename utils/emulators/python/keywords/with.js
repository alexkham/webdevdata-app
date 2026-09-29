// utils/emulators/python/keywords/with.js
//
// Emulator for the with-keyword demo tabs. The body of each demo computes
// 100 // n; numbers follow the Python value of the literal the code shows
// (utils/py-num.js), floor division comes from the try emulator. A
// NameError for 'inf' is raised inside the body, so the exits still run
// before it escapes — the log is lost with it, as in Python.

import { fromLiteral, toPy } from '../../../py-num.js';
import { floorDiv } from './try.js';

// Evaluate the body expression 100 // n the way Python does: name lookup
// (fromLiteral may raise NameError), then the division.
const body = (n) => toPy(floorDiv({ int: 100n }, fromLiteral(n)));

// with Tag('outer'), Tag('inner'): — exits run innermost first
function order(n) {
  const log = ['enter outer', 'enter inner'];
  try {
    log.push(body(n));
    log.push('exit inner', 'exit outer');
  } catch (e) {
    log.push('exit inner', 'exit outer');
    if (e.name !== 'ZeroDivisionError') throw e;
    log.push('caught outside');
  }
  return log;
}

// __exit__ returns True for ZeroDivisionError → suppressed
function suppress(n) {
  const log = ['enter'];
  try {
    log.push(body(n));
    log.push('rest of body');
    log.push('exit sees None');
  } catch (e) {
    log.push(`exit sees ${e.name}`);
    if (e.name !== 'ZeroDivisionError') throw e;
  }
  return log;
}

// @contextmanager with try / yield / finally
function generator(n) {
  const log = ['setup'];
  try {
    log.push(body(n));
    log.push('cleanup');
  } catch (e) {
    log.push('cleanup');
    if (e.name !== 'ZeroDivisionError') throw e;
    log.push(`error: ${e.message}`);
  }
  return log;
}

export default {
  order,
  suppress,
  contextmanager: generator,
};
