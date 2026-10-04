// utils/emulators/python/stdlib/string/formatter-get_value.js
//
// Emulator for the Formatter.get_value / get_field demo tabs, on the port
// in _pystring.js (a JS subclass mirrors the Python subclass in the snippet).

import { Formatter, pyObjRepr } from './_pystring.js';

class Default extends Formatter {
  get_value(key, args, kwargs) {
    if (typeof key === 'string') return kwargs.has(key) ? kwargs.get(key) : '<' + key + '?>';
    return super.get_value(key, args, kwargs);
  }
}

export default {
  // Default().format(fmt, 'first', name=name)
  default: (fmt, name) => new Default().format(fmt, ['first'], new Map([['name', name]])),

  // string.Formatter().get_field(field, ('xyz',), {'name': name})
  field: (field, name) => {
    const [obj, first] = new Formatter().get_field(field, ['xyz'], new Map([['name', name]]));
    return { __pyTuple: [pyObjRepr(obj), pyObjRepr(first)] };
  },
};
