// utils/emulators/python/stdlib/pickle/dumps.js
//
// Emulator for the pickle.dumps demo tabs, on the _pickle.c port in
// _pypickle.js and the ast.literal_eval port in _pyliteral.js.

import { literalEval } from './_pyliteral.js';
import { dumps, loads, pyRepr, bytesRepr, rawTuple, pyIsSeparate, PyList, typeName } from './_pypickle.js';
import { PyException } from '../../../../py-exceptions.js';

export default {
  // value = ast.literal_eval(value); data = pickle.dumps(value, protocol=protocol); (data, len(data))
  bytes: (text, protocol) => {
    const data = dumps(literalEval(text), protocol);
    return rawTuple(bytesRepr(data), String(data.length));
  },

  // row = ast.literal_eval(row)
  // shared = pickle.dumps([row, row]); copied = pickle.dumps([row, ast.literal_eval(row)])
  // back = pickle.loads(shared); (len(shared), len(copied), back[0] is back[1])
  shared: (text) => {
    const row = literalEval(text);
    const shared = dumps(new PyList([row, row]));
    const copied = dumps(new PyList([row, literalEval(text)]));
    const back = loads(shared);
    // the two items come out of one memo entry (same object) or were
    // pickled twice (ints are never memoized: separate objects, except
    // CPython's small-int cache)
    const [a, b] = back.items;
    const same = typeof a === 'bigint' ? pyIsSeparate(a, b) : a === b;
    return rawTuple(String(shared.length), String(copied.length), same ? 'True' : 'False');
  },

  // items = ast.literal_eval(items); items.append(items)
  // data = pickle.dumps(items, protocol=protocol); (data, pickle.loads(data))
  cycle: (text, protocol) => {
    const items = literalEval(text);
    if (!(items instanceof PyList)) throw new PyException('AttributeError', `'${typeName(items)}' object has no attribute 'append'`);
    items.items.push(items);
    const data = dumps(items, protocol);
    return rawTuple(bytesRepr(data), pyRepr(loads(data)));
  },
};
