// utils/emulators/python/stdlib/argparse/namespace.js
//
// Emulator for the argparse.Namespace demo on the CPython port in
// _argparse.js: parse the reader's command line, then show the Namespace,
// vars(args) and 'name' in args; _cli.js runs the shared template tail.

import { ArgumentParser, INT, SUPPRESS, PyDict, PyTuple } from './_argparse.js';
import { cli } from './_cli.js';

function build() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('--name', { default: SUPPRESS });
  parser.add_argument('--count', { type: INT, default: 1n });
  parser.add_argument('--log-file', { dest: 'log-file' });
  return parser;
}

// args = parser.parse_args(...)
// result = (args, vars(args), 'name' in args)
const inspect = (parser, argv) => {
  const args = parser.parse_args(argv);
  return new PyTuple([args, new PyDict([...args.__dict__]), args.__contains__('name')]);
};

export default {
  inspect: (cmdline) => cli(build, cmdline, inspect),
};
