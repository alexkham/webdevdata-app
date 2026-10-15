// utils/emulators/python/stdlib/argparse/parse_args.js
//
// Emulator for the parse_args demo (option value syntax, negative
// numbers, --) on the CPython port in _argparse.js; _cli.js runs the
// shared template tail.

import { ArgumentParser, INT } from './_argparse.js';
import { cli } from './_cli.js';

function build() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('-x', { type: INT });
  parser.add_argument('--name');
  parser.add_argument('values', { nargs: '*' });
  return parser;
}

export default {
  syntax: (cmdline) => cli(build, cmdline),
};
