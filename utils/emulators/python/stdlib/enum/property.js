// utils/emulators/python/stdlib/enum/property.js
//
// Emulator for the enum.property demo tabs (Lib/enum.py port in
// _pyenum.js: member lookup by name, then the member's own attributes).

import { defineEnum, ENUM, getitem, attr, pyTuple } from './_pyenum.js';

// str.title() for the ASCII member names of the template: upper-case a
// letter that follows a non-letter, lower-case the others
const title = (s) => s.replace(/[A-Za-z]+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

export default {
  // members called name, value, size — m = Field[member]; (m, m.name, m.value)
  names: (member) => {
    const m = getitem(defineEnum('Field', [ENUM], [['name', 'n'], ['value', 'v'], ['size', 's']]), member);
    return pyTuple(m, attr(m, 'name'), attr(m, 'value'));
  },

  // @property def label(self): return self.name.replace('_', ' ').title()
  label: (name) => {
    const m = getitem(defineEnum('Color', [ENUM], [['RED', 1n], ['DARK_BLUE', 2n]]), name);
    return title(m.name.replace(/_/g, ' '));
  },
};
