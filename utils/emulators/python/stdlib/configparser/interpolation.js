// utils/emulators/python/stdlib/configparser/interpolation.js
//
// Emulator for the configparser.Interpolation demo tabs, on the CPython port
// in _pyconfigparser.js. The two handlers are the fixed classes of the
// templates: EnvInterpolation (string.Template(value).safe_substitute(ENV))
// and Trace (records every hook call).

import { ConfigParser, Interpolation, asPy, joinLines, pyTypeName } from './_pyconfigparser.js';
import { PyException } from '../../../../py-exceptions.js';

const ENV = new Map([['HOME', '/home/ada'], ['USER', 'ada']]);

// string.Template(value).safe_substitute(mapping): $$ → $, $name / ${name}
// replaced when known, everything else left as it is
function safeSubstitute(value, mapping) {
  if (typeof value !== 'string') throw new PyException('TypeError', `expected string or bytes-like object, got '${pyTypeName(value)}'`);
  return value.replace(/\$(?:(\$)|([_a-zA-Z][_a-zA-Z0-9]*)|\{([_a-zA-Z][_a-zA-Z0-9]*)\}|())/g, (whole, escaped, named, braced) => {
    if (escaped !== undefined) return '$';
    const name = named !== undefined ? named : braced;
    if (name !== undefined) return mapping.has(name) ? mapping.get(name) : whole;
    return whole; // invalid placeholder: the lone $
  });
}

class EnvInterpolation extends Interpolation {
  before_get(parser, section, option, value) { return safeSubstitute(value, ENV); }
}

class Trace extends Interpolation {
  constructor(calls) { super(); this.calls = calls; }
  before_get(parser, section, option, value) { this.calls.push(`get ${option}`); return value; }
  before_set(parser, section, option, value) { this.calls.push(`set ${option}`); return value; }
  before_read(parser, section, option, value) { this.calls.push(`read ${option}`); return value; }
  before_write(parser, section, option, value) { this.calls.push(`write ${option}`); return value; }
}

export default {
  // config = configparser.ConfigParser(interpolation=EnvInterpolation())
  // config.read_string('[paths]\n' + line); dict(config['paths'])
  env: (line) => {
    const config = new ConfigParser({ interpolation: new EnvInterpolation() });
    config.read_string('[paths]\n' + line);
    return asPy(new Map(config.getitem('paths').items().map((t) => t.__pyTuple)));
  },

  // read, config['app']['added'] = 'yes', config.get('app', 'added'), write → calls
  hooks: (l1, l2, l3) => {
    const calls = [];
    const config = new ConfigParser({ interpolation: new Trace(calls) });
    config.read_string(joinLines(l1, l2, l3));
    config.getitem('app').setitem('added', 'yes');
    config.get('app', 'added');
    config.write(true);
    return asPy(calls);
  },
};
