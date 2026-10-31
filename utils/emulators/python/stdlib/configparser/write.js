// utils/emulators/python/stdlib/configparser/write.js
//
// Emulator for the ConfigParser.write demo tabs, on the CPython port in
// _pyconfigparser.js.

import { ConfigParser, asPy, joinLines, writeLines, tuple } from './_pyconfigparser.js';

export default {
  // config.read_string('\n'.join([...])); config.write(buf); buf.getvalue().splitlines()
  write: (...lines) => {
    const config = new ConfigParser();
    config.read_string(joinLines(...lines));
    return asPy(writeLines(config));
  },

  // config['s'] = {key: value}; written with and without spaces
  compact: (key, value) => {
    const config = new ConfigParser({ interpolation: null });
    config.setitem('s', [[key, value]]);
    return asPy(tuple(config.write(true), config.write(false)));
  },
};
