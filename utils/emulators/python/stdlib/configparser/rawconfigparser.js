// utils/emulators/python/stdlib/configparser/rawconfigparser.js
//
// Emulator for the configparser.RawConfigParser demo tabs, on the CPython
// port in _pyconfigparser.js.

import { ConfigParser, RawConfigParser, asPy, joinLines, fromAuto, tuple } from './_pyconfigparser.js';

export default {
  // raw / cooked read the same text; (raw.get('paths', key), cooked.get('paths', key))
  compare: (l1, l2, l3, key) => {
    const text = joinLines(l1, l2, l3);
    const raw = new RawConfigParser();
    const cooked = new ConfigParser();
    raw.read_string(text);
    cooked.read_string(text);
    // the tuple is built left to right: raw first, then cooked
    const a = raw.get('paths', key);
    const b = cooked.get('paths', key);
    return asPy(tuple(a, b));
  },

  // raw.add_section('app'); raw.set('app', 'workers', value)
  // (raw.get('app', 'workers'), raw.getint('app', 'workers'))
  store: (value) => {
    const raw = new RawConfigParser();
    raw.add_section('app');
    raw.set('app', 'workers', fromAuto(value));
    return asPy(tuple(raw.get('app', 'workers'), raw.getint('app', 'workers')));
  },
};
