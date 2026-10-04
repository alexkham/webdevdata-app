// utils/emulators/python/stdlib/string/template.js
//
// Emulator for the string.Template demo tabs, on the port in _pystring.js.

import { Template } from './_pystring.js';

export default {
  // Template(text).substitute(name=name, item=item)
  fill: (text, name, item) => new Template(text).substitute(new Map([['name', name], ['item', item]])),

  // Template(text).safe_substitute(name=name)
  safe: (text, name) => new Template(text).safe_substitute(new Map([['name', name]])),
};
