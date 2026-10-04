// utils/emulators/python/stdlib/string/formatter.js
//
// Emulator for the string.Formatter demo tabs, on the port in _pystring.js.

import { Formatter } from './_pystring.js';

export default {
  // string.Formatter().format(fmt, *args, name=name)
  format: (fmt, args, name) => new Formatter().format(fmt, args, new Map([['name', name]])),

  // values = {'city': city, 'temp': temp}; string.Formatter().vformat(fmt, (), values)
  vformat: (fmt, city, temp) => new Formatter().vformat(fmt, [], new Map([['city', city], ['temp', temp]])),
};
