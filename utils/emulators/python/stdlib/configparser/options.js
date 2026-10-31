// utils/emulators/python/stdlib/configparser/options.js
//
// Emulator for the options / has_option / remove_option demo tabs, on the
// CPython port in _pyconfigparser.js.

import { ConfigParser, asPy, tuple } from './_pyconfigparser.js';

const INI = '[DEFAULT]\ntimeout = 30\nhost = default\n[server]\nhost = example.com\nport = 8080';

export default {
  // (config.has_option(section, key), config.options(section))
  list: (section, key) => {
    const config = new ConfigParser();
    config.read_string(INI);
    const has = config.has_option(section, key);
    return asPy(tuple(has, config.options(section)));
  },

  // removed = config.remove_option('server', key); (removed, dict(config['server']))
  remove: (key) => {
    const config = new ConfigParser();
    config.read_string(INI);
    const removed = config.remove_option('server', key);
    return asPy(tuple(removed, new Map(config.getitem('server').items().map((t) => t.__pyTuple))));
  },
};
