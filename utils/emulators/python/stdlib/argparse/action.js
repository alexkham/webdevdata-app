// utils/emulators/python/stdlib/argparse/action.js
//
// Emulator for the argparse.Action demo tabs: the two Action subclasses
// the templates define (KeyValue, Toggle), written against the CPython
// port in _argparse.js; _cli.js runs the shared template tail
// (shlex.split, COLUMNS=60, SystemExit capture).

import { ArgumentParser, Action, ArgumentError, getattr, setattr } from './_argparse.js';
import { PyDict, pyRepr, pyIter, pyTypeName, raise } from './_pyvalue.js';
import { cli } from './_cli.js';

// class KeyValue(argparse.Action):
//     def __call__(self, parser, namespace, values, option_string=None):
//         items = dict(getattr(namespace, self.dest) or {})
//         for value in values:
//             key, sep, val = value.partition('=')
//             if not sep:
//                 raise argparse.ArgumentError(self, f'expected KEY=VALUE, got {value!r}')
//             items[key] = val
//         setattr(namespace, self.dest, items)
class KeyValue extends Action {
  call(parser, namespace, values) {
    const current = getattr(namespace, this.dest, null);
    // the attribute holds None (the default) or the dict an earlier -D built
    const items = current instanceof PyDict ? new PyDict([...current.map]) : new PyDict();
    for (const value of pyIter(values)) {
      if (typeof value !== 'string') raise('AttributeError', `'${pyTypeName(value)}' object has no attribute 'partition'`);
      const i = value.indexOf('=');
      if (i === -1) throw new ArgumentError(this, `expected KEY=VALUE, got ${pyRepr(value)}`);
      items.set(value.slice(0, i), value.slice(i + 1));
    }
    setattr(namespace, this.dest, items);
  }
}
KeyValue.pyName = 'KeyValue';

// class Toggle(argparse.Action):
//     def __init__(self, option_strings, dest, **kwargs):
//         super().__init__(option_strings, dest, nargs=0, **kwargs)
//     def __call__(self, parser, namespace, values, option_string=None):
//         setattr(namespace, self.dest, option_string == '--on')
//     def format_usage(self):
//         return ' | '.join(self.option_strings)
class Toggle extends Action {
  constructor(kwargs) { super({ ...kwargs, nargs: 0n }); }
  call(parser, namespace, values, optionString = null) { setattr(namespace, this.dest, optionString === '--on'); }
  format_usage() { return this.option_strings.join(' | '); }
}
Toggle.pyName = 'Toggle';

function keyvalue() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('target');
  parser.add_argument('-D', '--define', { nargs: '+', action: KeyValue, metavar: 'KEY=VALUE', help: 'set variables (repeatable)' });
  return parser;
}

function toggle() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('--on', '--off', { dest: 'enabled', action: Toggle, default: false, help: 'switch the feature on or off' });
  return parser;
}

export default {
  keyvalue: (cmdline) => cli(keyvalue, cmdline),
  toggle: (cmdline) => cli(toggle, cmdline),
};
