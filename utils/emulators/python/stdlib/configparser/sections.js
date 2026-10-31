// utils/emulators/python/stdlib/configparser/sections.js
//
// Emulator for the sections / has_section / add_section / remove_section /
// popitem demo tabs, on the CPython port in _pyconfigparser.js.

import { ConfigParser, asPy, joinLines, tuple } from './_pyconfigparser.js';

export default {
  // (config.sections(), config.has_section(name), name in config)
  list: (l1, l2, l3, name) => {
    const config = new ConfigParser();
    config.read_string(joinLines(l1, l2, l3));
    return asPy(tuple(config.sections(), config.has_section(name), config.contains(name)));
  },

  // config.add_section(name); config.sections()
  add: (name) => {
    const config = new ConfigParser();
    config.read_string('[web]\n[db]');
    config.add_section(name);
    return asPy(config.sections());
  },

  // removed = config.remove_section(name); first = config.popitem()
  remove: (name) => {
    const config = new ConfigParser();
    config.read_string('[DEFAULT]\nx = 1\n[web]\n[db]\n[cache]');
    const removed = config.remove_section(name);
    const first = config.popitem();
    return asPy(tuple(removed, first, config.sections()));
  },
};
