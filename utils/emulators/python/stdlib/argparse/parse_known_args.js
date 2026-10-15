// utils/emulators/python/stdlib/argparse/parse_known_args.js
//
// Emulator for the parse_known_args demo (a wrapper that keeps the
// arguments it does not know) on the CPython port in _argparse.js; _cli.js
// runs the shared template tail, here with parse_known_args.

import { ArgumentParser, INT } from './_argparse.js';
import { cli } from './_cli.js';

function wrapper() {
  const parser = new ArgumentParser({ prog: 'wrapper' });
  parser.add_argument('--timeout', { type: INT, default: 30n });
  parser.add_argument('-v', '--verbose', { action: 'store_true' });
  parser.add_argument('command');
  return parser;
}

export default {
  known: (cmdline) => cli(wrapper, cmdline, (p, argv) => p.parse_known_args(argv)),
};
