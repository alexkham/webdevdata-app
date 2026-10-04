// utils/emulators/python/stdlib/string/formatter-convert_field.js
//
// Emulator for the Formatter.convert_field / format_field demo tabs, on the
// port in _pystring.js (a JS subclass mirrors the Python subclass).

import { Formatter, pyStr, upper } from './_pystring.js';

class Upper extends Formatter {
  convert_field(value, conversion) {
    if (conversion === 'u') return upper(pyStr(value));
    return super.convert_field(value, conversion);
  }
}

export default {
  // f = string.Formatter(); f.format_field(f.convert_field(value, conv), spec)
  steps: (value, conv, spec) => {
    const f = new Formatter();
    return f.format_field(f.convert_field(value, conv), spec);
  },

  // Upper().format(fmt, name=name)
  custom: (fmt, name) => new Upper().format(fmt, [], new Map([['name', name]])),
};
