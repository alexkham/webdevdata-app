// utils/emulators/python/stdlib/argparse/suppress.js
//
// Emulator for the argparse.SUPPRESS demo tabs on the CPython port in
// _argparse.js; _cli.js runs the shared template tail.

import { ArgumentParser, INT, SUPPRESS } from './_argparse.js';
import { cli } from './_cli.js';

function hidden() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('--name', { default: SUPPRESS, help: 'only set when given' });
  parser.add_argument('--debug-dump', { action: 'store_true', help: SUPPRESS });
  parser.add_argument('--level', { type: INT, default: 1n });
  return parser;
}

function parserwide() {
  const parser = new ArgumentParser({ prog: 'app', argument_default: SUPPRESS });
  parser.add_argument('--host');
  parser.add_argument('--port', { type: INT });
  parser.add_argument('--tls', { action: 'store_true' });
  return parser;
}

export default {
  hidden: (cmdline) => cli(hidden, cmdline),
  parserwide: (cmdline) => cli(parserwide, cmdline),
};
