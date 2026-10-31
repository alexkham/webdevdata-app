// utils/emulators/python/stdlib/pprint/isreadable-isrecursive.js
//
// Emulator for the pprint.isreadable / isrecursive demo, on the
// Lib/pprint.py port in _pypprint.js.

import { literalEval } from '../pickle/_pyliteral.js';
import { PyList, typeName } from '../pickle/_pypickle.js';
import { PyException } from '../../../../py-exceptions.js';
import { isreadable, isrecursive } from './_pypprint.js';

const bool = (b) => ({ __pyRaw: b ? 'True' : 'False' });

export default {
  // data = ast.literal_eval(data); data.append(data)
  // (pprint.isrecursive(data), pprint.isreadable(data), pprint.isreadable(data[:-1]))
  selfref: (data) => {
    const value = literalEval(data);
    if (!(value instanceof PyList)) throw new PyException('AttributeError', `'${typeName(value)}' object has no attribute 'append'`);
    value.items.push(value);
    const before = new PyList(value.items.slice(0, -1));
    return { __pyTuple: [bool(isrecursive(value)), bool(isreadable(value)), bool(isreadable(before))] };
  },
};
