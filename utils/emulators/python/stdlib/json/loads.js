// utils/emulators/python/stdlib/json/loads.js
//
// Emulator for the json.loads demo tabs, on the CPython port in _pyjson.js.

import { loads, asPy, JSONDecodeError, PyFloat, PyDict } from './_pyjson.js';

const typeName = (v) => {
  if (v === null) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (v instanceof PyFloat) return 'float';
  if (typeof v === 'string') return 'str';
  if (Array.isArray(v)) return 'list';
  if (v instanceof PyDict) return 'dict';
  return 'object';
};

export default {
  parse: (text) => asPy(loads(text)),

  where: (text) => {
    try {
      loads(text);
    } catch (e) {
      if (!(e instanceof JSONDecodeError)) throw e;
      return { __pyTuple: [e.msg, e.lineno, e.colno] };
    }
    return 'valid JSON';
  },

  types: (text) => {
    const v = loads(text);
    // iterating a dict gives keys (str); a str gives characters
    let items;
    if (Array.isArray(v)) items = v;
    else if (v instanceof PyDict) items = v.entries.map(([k]) => k);
    else if (typeof v === 'string') items = [...v];
    else throw Object.assign(new Error(`'${typeName(v)}' object is not iterable`), { name: 'TypeError' });
    return items.map(typeName);
  },
};
