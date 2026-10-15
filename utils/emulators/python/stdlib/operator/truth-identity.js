// utils/emulators/python/stdlib/operator/truth-identity.js
//
// Emulator for the truth and identity functions page (truth, not_, is_,
// is_not), via _pyoperator.js.

import { auto, out, truth, tuple, identity } from './_pyoperator.js';

export default {
  // x = …; (operator.truth(x), operator.not_(x))
  truth: (x) => {
    const v = auto(x);
    return out(tuple(truth(v), !truth(v)));
  },

  // list(filter(operator.truth, items))
  filter: (items) => out(items.filter((v) => truth(v))),

  // values = [None if v == '-' else v for v in items]
  // ([v for v in values if operator.is_not(v, None)], list(filter(operator.truth, values)))
  none: (items) => {
    const values = items.map((v) => (v === '-' ? null : v));
    return out(tuple(values.filter((v) => !identity(v, null)), values.filter((v) => truth(v))));
  },
};
