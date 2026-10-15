// utils/emulators/python/stdlib/contextlib/contextdecorator.js
//
// Emulator for the contextlib.ContextDecorator demo tab: the decorated
// function runs inside `with self._recreate_cm():` exactly as
// ContextDecorator.__call__ does it (contextDecorate in _pycontextlib.js).

import { AbstractContextManager, contextDecorate, tryExcept } from './_pycontextlib.js';
import { fromLiteral, toPy } from '../../../../py-num.js';
import { floorDiv } from '../../keywords/try.js';

class Traced extends AbstractContextManager {
  constructor(label, log) {
    super();
    this.label = label;
    this.log = log;
  }
  get __typename() { return 'traced'; }
  _recreate_cm() { return this; } // ContextDecorator: the same instance every call
  __enter__() { this.log.push('start ' + this.label); return this; }
  __exit__() { this.log.push('end ' + this.label); return false; }
}

export default {
  // class traced(ContextDecorator): enter logs start, exit logs end, returns False
  // @traced(label) def divide(a, b): return a // b
  // try: log divide(100, n) except ZeroDivisionError: log error
  decorate: (label, n) => {
    const log = [];
    const divide = contextDecorate(new Traced(label, log), (a, b) => toPy(floorDiv(a, b)));
    tryExcept(
      () => {
        const b = fromLiteral(n); // the argument is evaluated before the call
        log.push(divide({ int: 100n }, b));
      },
      'ZeroDivisionError',
      () => log.push('error'),
    );
    return log;
  },
};
