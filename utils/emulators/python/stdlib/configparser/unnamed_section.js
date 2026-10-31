// utils/emulators/python/stdlib/configparser/unnamed_section.js
//
// Emulator for the UNNAMED_SECTION demo tabs, on the CPython port in
// _pyconfigparser.js.

import { ConfigParser, UNNAMED_SECTION, asPy, joinLines, writeLines, tuple } from './_pyconfigparser.js';

export default {
  // (config.sections(), dict(config[configparser.UNNAMED_SECTION]))
  read: (...lines) => {
    const config = new ConfigParser({ allowUnnamedSection: true });
    config.read_string(joinLines(...lines));
    const sections = config.sections();
    return asPy(tuple(sections, new Map(config.getitem(UNNAMED_SECTION).items().map((t) => t.__pyTuple))));
  },

  // config.read_string(key + ' = ' + value + '\n[db]\nhost = x'); write → splitlines()
  write: (key, value) => {
    const config = new ConfigParser({ allowUnnamedSection: true });
    config.read_string(`${key} = ${value}\n[db]\nhost = x`);
    return asPy(writeLines(config));
  },
};
