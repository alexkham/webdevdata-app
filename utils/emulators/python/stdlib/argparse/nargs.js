// utils/emulators/python/stdlib/argparse/nargs.js
//
// Emulator for the nargs demo tabs on the CPython port in _argparse.js;
// _cli.js runs the shared template tail.

import { ArgumentParser, INT, REMAINDER, PyTuple } from './_argparse.js';
import { cli } from './_cli.js';

function counts() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('src', { nargs: '+' });
  parser.add_argument('dst');
  parser.add_argument('--exclude', { nargs: '*', default: [] });
  parser.add_argument('--log', { nargs: '?', const: 'app.log' });
  parser.add_argument('--size', { nargs: 2n, type: INT, metavar: new PyTuple(['W', 'H']) });
  return parser;
}

function remainder() {
  const parser = new ArgumentParser({ prog: 'run' });
  parser.add_argument('--verbose', { action: 'store_true' });
  parser.add_argument('command');
  parser.add_argument('args', { nargs: REMAINDER });
  return parser;
}

export default {
  counts: (cmdline) => cli(counts, cmdline),
  remainder: (cmdline) => cli(remainder, cmdline),
};
