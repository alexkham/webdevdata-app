// utils/emulators/python/stdlib/pprint/saferepr.js
//
// Emulator for the pprint.saferepr demo tabs, on the Lib/pprint.py port in
// _pypprint.js. The recursion marker's id= (a memory address) is replaced
// in the snippet itself, so the text is the same on every run.

import { literalEval } from '../pickle/_pyliteral.js';
import { PyList, typeName } from '../pickle/_pypickle.js';
import { PyException } from '../../../../py-exceptions.js';
import { PrettyPrinter, rawRepr, shown, saferepr, addressAs } from './_pypprint.js';

export default {
  // data = ast.literal_eval(data)
  // (repr(data), pprint.saferepr(data))
  compare: (data) => {
    const value = literalEval(data);
    return { __pyTuple: [shown(rawRepr(value)), saferepr(value)] };
  },

  // box = ast.literal_eval(data); box.append(box)
  // (repr(box), pprint.saferepr(box).replace(f'id={id(box)}', 'id=ID'))
  recursive: (data) => {
    const box = literalEval(data);
    if (!(box instanceof PyList)) throw new PyException('AttributeError', `'${typeName(box)}' object has no attribute 'append'`);
    box.items.push(box);
    const safe = new PrettyPrinter()._safeRepr(box, new Set(), null, 0)[0];
    return { __pyTuple: [shown(rawRepr(box)), shown(addressAs(safe, 'ID'))] };
  },
};
