// utils/emulators/python/stdlib/string/formatter-check_unused_args.js
//
// Emulator for the Formatter.check_unused_args demo tabs, on the port in
// _pystring.js (JS subclasses mirror the Python subclasses in the snippets).
// used_args holds keyword names as str and positional indexes as '#<n>'.

import { Formatter } from './_pystring.js';
import { PyException } from '../../../../py-exceptions.js';
import { pyReprExact } from '../../../../demo-coerce.js';

const keyOf = (k) => (k.startsWith('#') ? { __pyRaw: k.slice(1) } : k);
const strOf = (k) => (k.startsWith('#') ? k.slice(1) : k);
// sorted(..., key=str): code point order of str(key)
const cmp = (a, b) => {
  const x = Array.from(strOf(a), (c) => c.codePointAt(0));
  const y = Array.from(strOf(b), (c) => c.codePointAt(0));
  for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) return x[i] - y[i];
  return x.length - y.length;
};

class Strict extends Formatter {
  check_unused_args(usedArgs, args, kwargs) {
    const unused = [...kwargs.keys()].filter((k) => !usedArgs.has(k)).sort(cmp);
    if (unused.length) throw new PyException('ValueError', `unused: ${pyReprExact(unused)}`);
  }
}
class Spy extends Formatter {
  check_unused_args(usedArgs) {
    this.used = usedArgs;
  }
}

export default {
  // Strict().format(fmt, a=a, b=b)
  strict: (fmt, a, b) => new Strict().format(fmt, [], new Map([['a', a], ['b', b]])),

  // s = Spy(); s.format(fmt, 'p0', 'p1', a='x', b='y'); sorted(s.used, key=str)
  used: (fmt) => {
    const s = new Spy();
    s.format(fmt, ['p0', 'p1'], new Map([['a', 'x'], ['b', 'y']]));
    return [...s.used].sort(cmp).map(keyOf);
  },
};
