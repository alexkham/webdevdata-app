// utils/emulators/python/stdlib/argparse/booleanoptionalaction.js
//
// Emulator for the BooleanOptionalAction demo on the CPython port in
// _argparse.js; _cli.js runs the shared template tail.

import { ArgumentParser, BooleanOptionalAction } from './_argparse.js';
import { cli } from './_cli.js';

function flags() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('--color', { action: BooleanOptionalAction, help: 'colorize the output' });
  parser.add_argument('--cache', { action: BooleanOptionalAction, default: true, help: 'reuse earlier results (default: %(default)s)' });
  return parser;
}

export default {
  flags: (cmdline) => cli(flags, cmdline),
};
