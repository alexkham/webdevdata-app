// utils/emulators/python/stdlib/configparser/extendedinterpolation.js
//
// Emulator for the configparser.ExtendedInterpolation demo tab, on the
// CPython port in _pyconfigparser.js.

import { ConfigParser, ExtendedInterpolation, asPy, joinLines } from './_pyconfigparser.js';

export default {
  // ConfigParser(interpolation=ExtendedInterpolation()); read_string(...); config.get(section, key)
  expand: (l1, l2, l3, l4, l5, section, key) => {
    const config = new ConfigParser({ interpolation: new ExtendedInterpolation() });
    config.read_string(joinLines(l1, l2, l3, l4, l5));
    return asPy(config.get(section, key));
  },
};
