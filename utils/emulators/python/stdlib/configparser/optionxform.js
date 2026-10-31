// utils/emulators/python/stdlib/configparser/optionxform.js
//
// Emulator for the ConfigParser.optionxform demo tabs, on the CPython port
// in _pyconfigparser.js.

import { ConfigParser, asPy, joinLines, sectionsDict, pyv, tuple } from './_pyconfigparser.js';
import { PyException } from '../../../../py-exceptions.js';

const strOf = (s) => (typeof s === 'string' ? s : pyv(s));
// transforms = {'default': None, 'str': str, 'upper': str.upper}
const TRANSFORMS = {
  default: null,
  str: strOf,
  upper: (s) => {
    if (typeof s !== 'string') throw new PyException('TypeError', "descriptor 'upper' for 'str' objects doesn't apply to a different type");
    return s.toUpperCase();
  },
};

export default {
  transform: (name, l1, l2, l3) => {
    if (!Object.prototype.hasOwnProperty.call(TRANSFORMS, name)) throw new PyException('KeyError', pyv(name));
    const config = new ConfigParser();
    if (TRANSFORMS[name] !== null) config.optionxform = TRANSFORMS[name];
    config.read_string(joinLines(l1, l2, l3));
    return asPy(sectionsDict(config));
  },

  // config.optionxform = str; (config.has_option('App', key), config['App'].get(key, 'not found'))
  lookup: (key) => {
    const config = new ConfigParser();
    config.optionxform = strOf;
    config.read_string('[App]\nDebugMode = on');
    return asPy(tuple(config.has_option('App', key), config.getitem('App').get(key, 'not found')));
  },
};
