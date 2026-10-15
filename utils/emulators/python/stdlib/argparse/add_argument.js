// utils/emulators/python/stdlib/argparse/add_argument.js
//
// Emulator for the add_argument demo tabs on the CPython port in
// _argparse.js; _cli.js runs the shared template tail.

import { ArgumentParser, INT, FLOAT } from './_argparse.js';
import { cli } from './_cli.js';

function values() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('size', { type: INT, help: 'width in pixels' });
  parser.add_argument('--format', { choices: ['png', 'jpeg', 'webp'], default: 'png' });
  parser.add_argument('--quality', { type: FLOAT, default: '0.8', help: '0 to 1 (default: %(default)s)' });
  return parser;
}

function names() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('input', { help: 'file to read' });
  parser.add_argument('-o', '--output-file', { metavar: 'FILE', required: true, help: 'where to write' });
  parser.add_argument('-n', { dest: 'count', type: INT, default: 1n, help: 'copies (default: %(default)s)' });
  return parser;
}

export default {
  values: (cmdline) => cli(values, cmdline),
  names: (cmdline) => cli(names, cmdline),
};
