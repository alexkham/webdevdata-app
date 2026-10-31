// utils/emulators/python/stdlib/configparser/basicinterpolation.js
//
// Emulator for the configparser.BasicInterpolation demo tabs, on the CPython
// port in _pyconfigparser.js.

import { ConfigParser, asPy, joinLines, tuple } from './_pyconfigparser.js';

export default {
  // (config.get('Paths', key), config.get('Paths', key, raw=True))
  expand: (l1, l2, l3, key) => {
    const config = new ConfigParser();
    config.read_string(joinLines('[Paths]', l1, l2, l3));
    const cooked = config.get('Paths', key);
    return asPy(tuple(cooked, config.get('Paths', key, { raw: true })));
  },

  // config.set('s', 'k', value); config.get('s', 'k', raw=True)
  setcheck: (value) => {
    const config = new ConfigParser();
    config.add_section('s');
    config.set('s', 'k', value);
    return asPy(config.get('s', 'k', { raw: true }));
  },
};
