// utils/emulators/python/stdlib/configparser/converters.js
//
// Emulator for the converters / ConverterMapping demo tabs, on the CPython
// port in _pyconfigparser.js. The converters are the fixed functions of the
// templates: the list lambda and str.upper.

import { ConfigParser, asPy, pyStrip, pyTypeName, tuple } from './_pyconfigparser.js';
import { PyException } from '../../../../py-exceptions.js';

// lambda value: [item.strip() for item in value.split(',')]
const listConv = (value) => {
  if (typeof value !== 'string') throw new PyException('AttributeError', `'${pyTypeName(value)}' object has no attribute 'split'`);
  return value.split(',').map(pyStrip);
};
// str.upper
const upper = (value) => {
  if (typeof value !== 'string') throw new PyException('TypeError', `descriptor 'upper' for 'str' objects doesn't apply to a '${pyTypeName(value)}' object`);
  return value.toUpperCase();
};

export default {
  // (config.getlist('app', 'hosts'), config['app'].getlist('hosts'), config['app'].getlist('missing'))
  getlist: (hosts) => {
    const config = new ConfigParser({ converters: new Map([['list', listConv]]) });
    config.read_dict([['app', [['hosts', hosts]]]]);
    const proxy = config.getitem('app');
    return asPy(tuple(config.callGetter('getlist', 'app', 'hosts'), proxy.callGetter('getlist', 'hosts'), proxy.callGetter('getlist', 'missing')));
  },

  // config.converters[name] = str.upper; config.read_string('[s]\nkey = value')
  // (list(config.converters), getattr(config['s'], 'get' + name)('key'))
  register: (name) => {
    const config = new ConfigParser();
    config.converters.setitem(name, upper);
    config.read_string('[s]\nkey = value');
    const keys = config.converters.keys();
    return asPy(tuple(keys, config.getitem('s').callGetter('get' + name, 'key')));
  },
};
