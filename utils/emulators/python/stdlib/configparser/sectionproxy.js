// utils/emulators/python/stdlib/configparser/sectionproxy.js
//
// Emulator for the configparser.SectionProxy demo tabs, on the CPython port
// in _pyconfigparser.js.

import { ConfigParser, asPy, joinLines, fromAuto, tuple } from './_pyconfigparser.js';

const DEMO_INI = '[DEFAULT]\ntimeout = 30\n[server]\nhost = example.com';

export default {
  // config.read_string('\n'.join([...])); config[section][key]
  access: (l1, l2, l3, l4, section, key) => {
    const config = new ConfigParser();
    config.read_string(joinLines(l1, l2, l3, l4));
    return asPy(config.getitem(section).getitem(key));
  },

  // server = config['server']; (server.get(key), server.get(key, fallback))
  get: (key, fallback) => {
    const config = new ConfigParser();
    config.read_string(DEMO_INI);
    const server = config.getitem('server');
    return asPy(tuple(server.get(key), server.get(key, fallback)));
  },

  // server['port'] = value
  // (config.get('server', 'port'), server.name, server.parser is config, dict(server))
  view: (value) => {
    const config = new ConfigParser();
    config.read_string('[server]\nhost = example.com');
    const server = config.getitem('server');
    server.setitem('port', fromAuto(value));
    return asPy(tuple(config.get('server', 'port'), server.name, server.parser === config, new Map(server.items().map((t) => t.__pyTuple))));
  },
};
