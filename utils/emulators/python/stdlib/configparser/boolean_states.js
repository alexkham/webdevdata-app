// utils/emulators/python/stdlib/configparser/boolean_states.js
//
// Emulator for the ConfigParser.BOOLEAN_STATES demo tabs, on the CPython
// port in _pyconfigparser.js.

import { ConfigParser, asPy } from './_pyconfigparser.js';

function getbool(value, states) {
  const config = new ConfigParser();
  if (states) config.BOOLEAN_STATES = states;
  config.read_dict([['features', [['cache', value]]]]);
  return asPy(config.getboolean('features', 'cache'));
}

export default {
  // config.read_dict({'features': {'cache': value}}); config.getboolean('features', 'cache')
  default: (value) => getbool(value, null),

  // config.BOOLEAN_STATES = {'enabled': True, 'disabled': False}
  custom: (value) => getbool(value, new Map([['enabled', true], ['disabled', false]])),
};
