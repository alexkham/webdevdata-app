// utils/emulators/python/stdlib/configparser/items.js
//
// Emulator for the items demo tabs, on the CPython port in
// _pyconfigparser.js.

import { ConfigParser, asPy, joinLines, tuple } from './_pyconfigparser.js';

export default {
  // config.items(section)
  section: (l1, l2, l3, l4, section) => {
    const config = new ConfigParser();
    config.read_string(joinLines(l1, l2, l3, l4));
    return asPy(config.items(section));
  },

  // (config.items('paths', raw=True), config.items('paths', vars={'base': base, 'extra': 'x'}))
  rawvars: (base) => {
    const config = new ConfigParser();
    config.read_string('[paths]\nbase = /srv/app\nlogs = %(base)s/logs');
    const a = config.items('paths', { raw: true });
    const b = config.items('paths', { vars: new Map([['base', base], ['extra', 'x']]) });
    return asPy(tuple(a, b));
  },

  // list(config.items())
  all: (l1, l2) => {
    const config = new ConfigParser();
    config.read_string(joinLines(l1, l2));
    return asPy(config.items());
  },
};
