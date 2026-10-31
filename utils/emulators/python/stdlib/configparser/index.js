// utils/emulators/python/stdlib/configparser/index.js
//
// Emulator for the configparser module hub demo, on the CPython port in
// _pyconfigparser.js.

import { ConfigParser, asPy, joinLines, sectionsDict, writeLines, fromAuto, tuple } from './_pyconfigparser.js';

export default {
  // config.read_string('\n'.join([...])); {name: dict(config[name]) for name in config.sections()}
  read: (...lines) => {
    const config = new ConfigParser();
    config.read_string(joinLines(...lines));
    return asPy(sectionsDict(config));
  },

  // config.read_dict({'app': {...}}); app = config['app']
  // (app['workers'], app.getint('workers'), app.getboolean('debug'), app.getfloat('ratio'))
  getters: (workers, debug, ratio) => {
    const config = new ConfigParser();
    config.read_dict([['app', [['workers', workers], ['debug', debug], ['ratio', ratio]]]]);
    const app = config.getitem('app');
    return asPy(tuple(app.getitem('workers'), app.callGetter('getint', 'workers'), app.callGetter('getboolean', 'debug'), app.callGetter('getfloat', 'ratio')));
  },

  // config['server'] = {'host': host, 'port': port}; config['server']['note'] = note
  // config.write(buf); buf.getvalue().splitlines()
  write: (host, port, note) => {
    const config = new ConfigParser();
    config.setitem('server', [['host', host], ['port', fromAuto(port)]]);
    config.getitem('server').setitem('note', note);
    return asPy(writeLines(config));
  },
};
