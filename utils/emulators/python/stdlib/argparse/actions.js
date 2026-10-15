// utils/emulators/python/stdlib/argparse/actions.js
//
// Emulator for the action= demo tabs on the CPython port in _argparse.js;
// _cli.js runs the shared template tail.

import { ArgumentParser } from './_argparse.js';
import { cli } from './_cli.js';

function flags() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('-v', '--verbose', { action: 'count', default: 0n });
  parser.add_argument('--debug', { action: 'store_true' });
  parser.add_argument('--no-cache', { dest: 'cache', action: 'store_false' });
  parser.add_argument('--fast', { dest: 'mode', action: 'store_const', const: 'fast', default: 'normal' });
  parser.add_argument('--version', { action: 'version', version: '%(prog)s 2.1' });
  return parser;
}

function lists() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('--tag', { action: 'append' });
  parser.add_argument('--include', { action: 'extend', nargs: '+' });
  parser.add_argument('--csv', { dest: 'formats', action: 'append_const', const: 'csv' });
  parser.add_argument('--json', { dest: 'formats', action: 'append_const', const: 'json' });
  return parser;
}

export default {
  flags: (cmdline) => cli(flags, cmdline),
  lists: (cmdline) => cli(lists, cmdline),
};
