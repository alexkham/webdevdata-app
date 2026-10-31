// utils/emulators/python/stdlib/configparser/read.js
//
// Emulator for the read / read_file / read_string / read_dict demo tabs, on
// the CPython port in _pyconfigparser.js. The files the snippet writes are
// kept in a small name → text map; read() skips names that are not in it,
// as CPython skips files it cannot open.

import { ConfigParser, asPy, joinLines, sectionsDict, fromAuto, tuple, limit } from './_pyconfigparser.js';

const hasLoneSurrogate = (s) => /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(s);

export default {
  // base.ini and local.ini written with encoding='utf-8'
  // found = config.read(['base.ini', 'missing.ini', 'local.ini'], encoding='utf-8')
  files: (override) => {
    if (hasLoneSurrogate(override)) limit('A lone surrogate cannot be written as UTF-8 (UnicodeEncodeError) — not reproduced here.');
    const files = new Map([
      ['base.ini', '[server]\nport = 80\nhost = example.com\n'],
      ['local.ini', `[server]\n${override}\n`],
    ]);
    const config = new ConfigParser();
    const found = config.read(['base.ini', 'missing.ini', 'local.ini'], files);
    return asPy(tuple(found, new Map(config.getitem('server').items().map((t) => t.__pyTuple))));
  },

  // config.read_string('\n'.join([...]), source=source)
  string: (l1, l2, l3, source) => {
    const config = new ConfigParser();
    config.read_string(joinLines(l1, l2, l3), source);
    return asPy(sectionsDict(config));
  },

  // config.read_dict({'server': {'port': port, key: value}}); dict(config['server'])
  dict: (port, key, value) => {
    // the dict literal itself: an identical key keeps its first position, last value
    const inner = new Map([['port', fromAuto(port)]]);
    inner.set(key, fromAuto(value));
    const config = new ConfigParser();
    config.read_dict(new Map([['server', inner]]));
    return asPy(new Map(config.getitem('server').items().map((t) => t.__pyTuple)));
  },
};
