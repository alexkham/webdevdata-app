// utils/emulators/python/stdlib/argparse/argumentparser.js
//
// Emulator for the ArgumentParser demo tabs (allow_abbrev, prefix_chars,
// exit_on_error=False) on the CPython port in _argparse.js; _cli.js runs
// the shared template tail (shlex.split, COLUMNS=60, SystemExit capture).

import { ArgumentParser, INT } from './_argparse.js';
import { cli } from './_cli.js';

function abbrev() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('--color', { choices: ['auto', 'never', 'always'], default: 'auto' });
  parser.add_argument('--columns', { type: INT, default: 80n });
  parser.add_argument('--verbose', { action: 'store_true' });
  return parser;
}

function prefix() {
  const parser = new ArgumentParser({ prog: 'app', prefix_chars: '-+' });
  parser.add_argument('+w', { dest: 'warnings', action: 'store_true', help: 'turn warnings on' });
  parser.add_argument('-w', { dest: 'warnings', action: 'store_false', help: 'turn warnings off' });
  parser.add_argument('-o', '--output');
  return parser;
}

function noexit() {
  const parser = new ArgumentParser({ prog: 'app', exit_on_error: false });
  parser.add_argument('host');
  parser.add_argument('--port', { type: INT, default: 8080n });
  return parser;
}

export default {
  abbrev: (cmdline) => cli(abbrev, cmdline),
  prefix: (cmdline) => cli(prefix, cmdline),
  noexit: (cmdline) => cli(noexit, cmdline),
};
