// utils/emulators/python/stdlib/decimal/defaultcontext-basiccontext-extendedcontext.js
//
// Emulator for the template-context demo: the same division under a copy
// of DefaultContext, BasicContext and ExtendedContext (_pydecimal.js).

import * as D from './_pydecimal.js';

export default {
  // for template in (Default, Basic, Extended): a / b, or the exception name
  compare: (a, b) => D.run(() => {
    const results = [];
    for (const template of [D.DefaultContext, D.BasicContext, D.ExtendedContext]) {
      D.withContext(D.localcontext({}, template), () => {
        try {
          results.push(D.opTruediv(D.dec(a), D.dec(b)));
        } catch (e) {
          if (!D.excIs(e, 'ArithmeticError')) throw e;
          results.push(D.excName(e));
        }
      });
    }
    return results;
  }),
};
