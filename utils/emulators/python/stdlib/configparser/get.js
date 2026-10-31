// utils/emulators/python/stdlib/configparser/get.js
//
// Emulator for the get / getint / getfloat / getboolean demo tabs, on the
// CPython port in _pyconfigparser.js.

import { ConfigParser, asPy, fromAuto, tuple, limit } from './_pyconfigparser.js';

const GETTERS = ['get', 'getint', 'getfloat', 'getboolean'];

export default {
  // config.read_dict({'app': {'value': value}}); getattr(config, getter)('app', 'value')
  convert: (value, getter) => {
    if (!GETTERS.includes(getter)) limit(`The browser demo calls get, getint, getfloat or getboolean (not ${JSON.stringify(getter)}).`);
    const config = new ConfigParser();
    config.read_dict([['app', [['value', value]]]]);
    return asPy(config.callGetter(getter, 'app', 'value'));
  },

  // config.getint('app', key, fallback=fallback)
  fallback: (key, fallback) => {
    const config = new ConfigParser();
    config.read_string('[app]\nworkers = 4\ntimeout = soon');
    return asPy(config.getint('app', key, { fallback: fromAuto(fallback) }));
  },

  // (get, get(raw=True), get(vars={'base': base}))
  rawvars: (base) => {
    const config = new ConfigParser();
    config.read_string('[paths]\nbase = /srv/app\nlogs = %(base)s/logs');
    const a = config.get('paths', 'logs');
    const b = config.get('paths', 'logs', { raw: true });
    const c = config.get('paths', 'logs', { vars: new Map([['base', base]]) });
    return asPy(tuple(a, b, c));
  },
};
