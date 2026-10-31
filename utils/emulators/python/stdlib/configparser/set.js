// utils/emulators/python/stdlib/configparser/set.js
//
// Emulator for the ConfigParser.set demo tabs, on the CPython port in
// _pyconfigparser.js.

import { ConfigParser, asPy, fromAuto } from './_pyconfigparser.js';

export default {
  // config.set(section, key, value); {name: dict(config[name]) for name in config}
  where: (section, key, value) => {
    const config = new ConfigParser();
    config.read_string('[server]\nhost = example.com');
    config.set(section, key, value);
    return asPy(new Map(config.keys().map((name) => [name, new Map(config.getitem(name).items().map((t) => t.__pyTuple))])));
  },

  // config.add_section('server'); config.set('server', 'port', value)
  // config.get('server', 'port', raw=True)
  checks: (value) => {
    const config = new ConfigParser();
    config.add_section('server');
    config.set('server', 'port', fromAuto(value));
    return asPy(config.get('server', 'port', { raw: true }));
  },
};
