// utils/emulators/python/stdlib/string/template-attributes.js
//
// Emulator for the Template class-attribute demo tabs, on the port in
// _pystring.js (the subclass attributes become constructor options).

import { Template } from './_pystring.js';

export default {
  // class Percent(Template): delimiter = '%'
  // Percent(text).safe_substitute(name=name)
  percent: (text, name) => new Template(text, { delimiter: '%' }).safe_substitute(new Map([['name', name]])),

  // class Dotted(Template): idpattern = r'(?a:[_a-z][_a-z0-9.]*)'   (IGNORECASE)
  // Dotted(text).safe_substitute({'user.name': name, 'user': 'U'})
  dotted: (text, name) =>
    new Template(text, { idpattern: '[_a-zA-Z][_a-zA-Z0-9.]*' }).safe_substitute(new Map([['user.name', name], ['user', 'U']])),
};
