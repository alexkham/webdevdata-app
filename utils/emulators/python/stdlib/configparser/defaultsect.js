// utils/emulators/python/stdlib/configparser/defaultsect.js
//
// Emulator for the DEFAULTSECT / defaults() demo tabs, on the CPython port
// in _pyconfigparser.js.

import { ConfigParser, asPy, joinLines, sectionsDict, tuple } from './_pyconfigparser.js';

export default {
  // (config.defaults(), {name: dict(config[name]) for name in config.sections()})
  inherit: (...lines) => {
    const config = new ConfigParser();
    config.read_string(joinLines(...lines));
    return asPy(tuple(config.defaults(), sectionsDict(config)));
  },

  // configparser.ConfigParser(default_section=name); (config.defaults(), config.sections())
  rename: (name) => {
    const config = new ConfigParser({ defaultSection: name });
    config.read_string('[general]\nroot = /srv\n[DEFAULT]\nmode = test\n[web]\nport = 80');
    return asPy(tuple(config.defaults(), config.sections()));
  },
};
