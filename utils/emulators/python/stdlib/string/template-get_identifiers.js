// utils/emulators/python/stdlib/string/template-get_identifiers.js
//
// Emulator for the Template.get_identifiers / is_valid demo, on the port in
// _pystring.js.

import { Template } from './_pystring.js';

export default {
  // t = Template(text); (t.get_identifiers(), t.is_valid())
  inspect: (text) => {
    const t = new Template(text);
    return { __pyTuple: [t.get_identifiers(), { __pyRaw: t.is_valid() ? 'True' : 'False' }] };
  },
};
