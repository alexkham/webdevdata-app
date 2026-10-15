// utils/emulators/python/stdlib/dataclasses/replace.js
//
// Emulator for the replace() demo tabs, on the CPython port in
// _pydataclasses.js (replace / _replace → the generated __init__).

import {
  makeClass, dataclass, replace, method, callClass, getattr, richcmp, truthy, raise, str, T,
  numLit, autoLit, show, run, tuple,
} from './_pydataclasses.js';

function configClass(withDebug) {
  const body = [
    { ann: 'host', type: T.str, value: 'localhost' },
    { ann: 'port', type: T.int, value: 8000n },
  ];
  if (withDebug) body.push({ ann: 'debug', type: T.bool, value: false });
  return dataclass(makeClass('Config', { body }), { frozen: true });
}

export default {
  // base = Config(); dev = replace(base, port=port, host=host); (base, dev)
  change: (port, host) => run(() => {
    const Config = configClass(true);
    const base = callClass(Config, []);
    const dev = replace(base, [['port', numLit(port)], ['host', host]]);
    return show(tuple(base, dev));
  }),

  // replace(Config(), **{name: value})
  name: (name, value) => run(() => {
    const Config = configClass(false);
    const obj = callClass(Config, []);
    return show(replace(obj, [[name, autoLit(value)]]));
  }),

  // r = Range(0, 10); replace(r, stop=stop) — __post_init__ validates
  validate: (stop) => run(() => {
    const Range = dataclass(makeClass('Range', {
      body: [
        { ann: 'start', type: T.int },
        { ann: 'stop', type: T.int },
        {
          name: '__post_init__',
          value: method('Range', '__post_init__', ['self'], ([self]) => {
            if (truthy(richcmp(getattr(self, 'stop'), getattr(self, 'start'), 'lt'))) {
              // f'stop {self.stop} < start {self.start}': format(v, '') is str(v) here
              raise('ValueError', `stop ${str(getattr(self, 'stop'))} < start ${str(getattr(self, 'start'))}`);
            }
            return null;
          }),
        },
      ],
    }), { frozen: true });
    const r = callClass(Range, [0n, 10n]);
    return show(replace(r, [['stop', numLit(stop)]]));
  }),
};
