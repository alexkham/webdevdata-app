// utils/emulators/python/exceptions/typeerror.js
//
// Emulator for the TypeError demo modes. The lesson is the operand-type
// rules of +: int/float mix freely, str only joins str, and the wording
// of the error depends on which side the str is on (str.__add__ gives
// "can only concatenate", the int side falls through to "unsupported
// operand type(s)").

import { raise } from '../../../py-exceptions.js';
import { pyValue, reprOf, raw, strRepr, intFromStr } from './valueerror.js';

const isNum = (p) => p.t === 'int' || p.t === 'float';
const toFloat = (p) => (p.t === 'int' ? Number(p.v) : p.v);

function add(a, b) {
  if (a.t === 'str') {
    if (b.t === 'str') return { t: 'str', v: a.v + b.v };
    return raise('TypeError', `can only concatenate str (not "${b.t}") to str`);
  }
  if (isNum(a) && isNum(b)) {
    if (a.t === 'int' && b.t === 'int') return { t: 'int', v: a.v + b.v };
    return { t: 'float', v: toFloat(a) + toFloat(b) };
  }
  return raise('TypeError', `unsupported operand type(s) for +: '${a.t}' and '${b.t}'`);
}

function mul(a, b) {
  if (a.t === 'int' && b.t === 'int') return { t: 'int', v: a.v * b.v };
  return { t: 'float', v: toFloat(a) * toFloat(b) };
}

export default {
  trigger: (a, b) => {
    const pa = pyValue(a);
    const pb = pyValue(b);
    return raw(reprOf(add(pa, pb)));
  },

  raise: (side) => {
    const p = pyValue(side);
    if (!isNum(p)) raise('TypeError', `side must be a number, not ${p.t}`);
    return raw(reprOf(mul(p, p)));
  },

  handle: (value) => {
    let n;
    try {
      if (value === null) {
        raise('TypeError', "int() argument must be a string, a bytes-like object or a real number, not 'NoneType'");
      }
      n = intFromStr(value).toString();
    } catch (e) {
      if (e.name !== 'TypeError' && e.name !== 'ValueError') throw e;
      return raw(strRepr(`${e.name}: ${e.message}`));
    }
    return raw(n);
  },
};
