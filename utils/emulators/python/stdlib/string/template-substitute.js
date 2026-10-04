// utils/emulators/python/stdlib/string/template-substitute.js
//
// Emulator for the Template.substitute / safe_substitute demo tabs, on the
// port in _pystring.js.

import { Template } from './_pystring.js';

export default {
  // t = Template(text); values = {'name': name}
  // strict = t.substitute(values), or 'KeyError: ...' / 'ValueError: ...'
  // (t.safe_substitute(values), strict)
  both: (text, name) => {
    const t = new Template(text);
    const values = new Map([['name', name]]);
    let strict;
    try {
      strict = t.substitute(values);
    } catch (e) {
      if (e.name !== 'KeyError' && e.name !== 'ValueError') throw e;
      strict = `${e.name}: ${e.message}`;
    }
    return { __pyTuple: [t.safe_substitute(values), strict] };
  },

  // Template(text).substitute({'a': a, 'b': 'from dict'}, b=b) — keywords win
  merge: (text, a, b) => new Template(text).substitute(new Map([['a', a], ['b', b]])),
};
